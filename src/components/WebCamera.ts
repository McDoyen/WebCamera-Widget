import { CSSProperties, Component, ReactElement, createElement } from "react";
import { findDOMNode } from "react-dom";
import * as WebCam from "react-webcam";
import * as classNames from "classnames";

import { Alert, AlertProps } from "./Alert";

import "../ui/WebCamera.scss";

export interface WebCameraProps {
    captureButtonName: string;
    captureButtonIcon: string;
    captionsToUse: string;
    fileType: string;
    filter: string;
    height: number;
    heightUnit: string;
    onClickAction: (image: { src: string, id: string }, microflowName: string) => void;
    recaptureButtonName: string;
    style?: object;
    switchCameraIcon: string;
    saveImage: string;
    usePictureButtonIcon: string;
    usePictureButtonName: string;
    width: number;
    widthUnit: string;
}

export interface WebCameraState {
    noBrowserSupport: boolean;
    cameraDevicePosition: number;
    screenshot: string;
    noRepeat: boolean;
    pictureTaken: boolean;
    pictureId: string;
}

export interface Webcam {
    getScreenshot: () => string;
}

export class WebCamera extends Component<WebCameraProps, WebCameraState> {
    private webcam: Webcam;
    private constraints: MediaStreamConstraints;
    private videoElement: HTMLVideoElement;
    private outputStream: MediaStream;
    private availableDevices: string[];

    constructor(props: WebCameraProps) {
        super(props);

        this.state = {
            cameraDevicePosition: 0,
            noBrowserSupport: false,
            noRepeat: false,
            pictureId: "",
            pictureTaken: false,
            screenshot: ""
        };

        this.availableDevices = [];
        this.setCameraReference = this.setCameraReference.bind(this);
        this.retakePicture = this.retakePicture.bind(this);
        this.getStream = this.getStream.bind(this);
        this.setStyle = this.setStyle.bind(this);
        this.takePicture = this.takePicture.bind(this);
    }

    render() {
        if (this.state.noBrowserSupport) {
            return this.renderAlert("This browser does not support the camera widget. Google-chrome is recommended.");
        }
        if (this.state.pictureTaken && this.state.screenshot) {
            return this.renderPhoto();
        }

        return this.renderWebCam();
    }

    private renderWebCam(): ReactElement<{}> {
        return createElement("div", { className: classNames("parent") },
            createElement(WebCam, {
                audio: false,
                ref: this.setCameraReference,
                screenshotFormat: `image/${this.props.fileType}`,
                style: this.setStyle()
            }),
            createElement("span", {
                className: classNames("picture-class"),
                onClick: this.takePicture
            },
                this.createIcons(this.props.captureButtonName, this.props.captureButtonIcon)
            )
        );
    }

    private renderPhoto(): ReactElement<{}> {
        return createElement("div", { className: classNames("parent") },
            createElement("img", {
                alt: "Image could not be found!",
                src: this.state.screenshot,
                style: this.setStyle()
            }),
            createElement("span", {
                className: classNames("picture-class"),
                onClick: this.retakePicture
            },
                this.createIcons(this.props.recaptureButtonName, this.props.captureButtonIcon)
            ),
            createElement("span", {
                className: classNames("switch-button"),
                onClick: () => this.props.onClickAction({
                    id: this.state.pictureId,
                    src: this.state.screenshot
                }, this.props.saveImage)
            },
                this.createIcons(this.props.usePictureButtonName, this.props.usePictureButtonIcon)
            )
        );
    }

    private renderAlert(message: string): ReactElement<AlertProps> {
        return createElement(Alert, {
            bootstrapStyle: "danger",
            className: "",
            message
        });
    }

    componentDidUpdate() {
        if (this.state.noBrowserSupport) {
            return null;
        } else {
            this.getStream();
        }
    }

    componentWillMount() {
        if (!navigator.mediaDevices) {
            this.setState({ noBrowserSupport: true });
        } else {
            navigator.mediaDevices.enumerateDevices()
                .then((devices: Array<{ kind: string, deviceId: string }>) => {
                    devices.filter((device: { kind: string, deviceId: string }) => {
                        if (device.kind === "videoinput") {
                            this.availableDevices.push(device.deviceId);
                        }
                    });
                })
                .catch((error: Error) => {
                    mx.ui.error(`${error.name}: ${error.message}`);
                });
        }
    }

    private setCameraReference(webcam: Webcam) {
        this.webcam = webcam;
    }

    private createIcons(buttonLabel: string, styleName: string): ReactElement<{}> {
        return (this.props.captionsToUse === "icons")
            ? createElement("span", { className: classNames(`glyphicon glyphicon-${styleName}`) })
            : createElement("button", { className: classNames("btn btn-inverse active") }, buttonLabel);
    }

    private takePicture() {
            this.setState({
                pictureId: `${this.outputStream.id}.${this.props.fileType}`,
                pictureTaken: true,
                screenshot: this.webcam.getScreenshot()
            });
    }

    private retakePicture() {
        this.setState({
            pictureId: "",
            pictureTaken: false,
            screenshot: ""
        });
    }

    private setStyle(): object {
        const style: CSSProperties = {
            filter: this.props.filter,
            width: this.props.widthUnit === "percentage" ? `${this.props.width}%` : `${this.props.width}px`
        };

        if (this.props.heightUnit === "percentageOfWidth") {
            style.paddingBottom = `${this.props.height}%`;
        } else if (this.props.heightUnit === "pixels") {
            style.height = `${this.props.height}px`;
        } else if (this.props.heightUnit === "percentageOfParent") {
            style.height = `${this.props.height}%`;
        }

        return { ...style, ...this.props.style };
    }

    private getStream() {
        this.constraints = {
            audio: false,
            video: { deviceId: this.availableDevices[this.state.cameraDevicePosition] }
        };

        if (this.outputStream && this.state.pictureTaken) {
            this.outputStream.getTracks().forEach((mediaTrack: MediaStreamTrack) => {
                mediaTrack.stop();
            });
        }

        if (this.state.noRepeat) {
            //
        } else {
            this.videoElement = findDOMNode(this).firstChild as HTMLVideoElement;
            navigator.mediaDevices.getUserMedia(this.constraints)
                .then((stream: MediaStream) => {
                    this.outputStream = stream;
                    if (this.videoElement) {
                        this.videoElement.srcObject = stream;
                    }
                })
                .catch((error: Error) => {
                    mx.ui.error(`${error.name}: ${error.message}`);
                });
        }
    }
}
