import { Component, createElement } from "react";

import { FileFormats, WebCamera } from "./WebCamera";

interface WrapperProps {
    class?: string;
    mxObject: mendix.lib.MxObject;
    style?: object;
}

export interface ModelerProps extends WrapperProps {
    saveImage: string;
    captureButtonName: string;
    recaptureButtonName: string;
    usePictureButtonName: string;
    fileType: FileFormats;
    photo: string;
    widthUnit: string;
    heightUnit: string;
    width: number;
    height: number;
    captureButtonIcon: string;
    switchCameraIcon: string;
    usePictureButtonIcon: string;
    captionsToUse: string;
    name: string;
    contents: string;
 }

export interface ContainerProps extends ModelerProps {
    onClickAction: (image: { src: string, id: string }, microflowName: string) => {};
    imageFilter: string;
    filter: string;
}

export default class CameraContainer extends Component<ContainerProps> {
    private base64: string;

    constructor(props: ContainerProps) {
        super(props);

        this.setFilter = this.setFilter.bind(this);
        this.executeMicroflow = this.executeMicroflow.bind(this);
        this.savePhoto = this.savePhoto.bind(this);
        this.base64toBlob = this.base64toBlob.bind(this);
    }

    render() {
        return createElement(WebCamera as any, {
            ...this.props as ModelerProps,
            filter: this.setFilter(),
            onClickAction: this.savePhoto
        });
    }

    private setFilter(): string {
        if (this.props.imageFilter === "grayscale") {
            return "grayscale(1)";
        }
        if (this.props.imageFilter === "huerotate") {
            return "hue-rotate(90deg)";
        }
        if (this.props.imageFilter === "sepia") {
            return "sepia(1)";
        }

        return "none";
    }

    private savePhoto(image: { src: string, id: string }, microflow: string) {
        if (this.props.mxObject.inheritsFrom("System.Image") && image.src) {
            mx.data.saveDocument(
                this.props.mxObject.getGuid(),
                image.id,
                {},
                this.base64toBlob(image.src),
                () => {
                    mx.ui.info("Image has been saved", false);
                    if (microflow) {
                    window.mx.ui.action(microflow, {
                        error: (error) => {
                            window.mx.ui.error(`Error while executing microflow ${microflow}: ${error.message}`);
                        },
                        params: {
                            applyto: "selection",
                            guids: [ this.props.mxObject.getGuid() ]
                        }
                    }, this);
                }
                },
                error => { mx.ui.error(error.message, false); }
            );
        } else {
            mx.ui.error("The entity does not inherit from System Image", false);
        }
    }

    private executeMicroflow(image: { src: string, id: string }, microflow: string) {
        mx.data.create({
            callback: (object) => {
                const reader = new FileReader();

                reader.readAsBinaryString(this.base64toBlob(image.src));
                object.set(this.props.contents, this.base64);
                object.set(this.props.name, image.id);

                window.mx.ui.action(microflow, {
                    error: (error) => {
                        window.mx.ui.error(`Error while executing microflow ${microflow}: ${error.message}`);
                    },
                    params: {
                        applyto: "selection",
                        guids: [ object.getGuid() ]
                    }
                }, this);
            },
            entity: this.props.photo,
            error: error => {
                mx.ui.error(`Could not create object: ${error}`);
            }
        });
    }

    private base64toBlob(base64Uri: string): Blob {
        const byteString = atob(base64Uri.split(",")[1]);
        const bufferArray = new ArrayBuffer(byteString.length);
        const uintArray = new Uint8Array(bufferArray);

        for (let i = 0; i < byteString.length; i++) {
            uintArray[i] = byteString.charCodeAt(i);
        }

        return new Blob([ bufferArray ]);
    }
}
