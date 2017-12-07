import { Component, createElement } from "react";

import { WebCamera, WebCameraState } from "./components/WebCamera";
import { ContainerProps, ModelerProps } from "./components/WebCameraContainer";

declare function require(name: string): string;

// tslint:disable-next-line class-name
export class preview extends Component<ContainerProps, WebCameraState> {
    constructor(props: ContainerProps) {
        super(props);

    }

    render() {
        return createElement(WebCamera as any, {
            ...this.props as ModelerProps,
            filter: () => { return; },
            onClickAction: () => { return; }
        });
    }
}

export function getPreviewCss() {
    return require("./ui/WebCamera.scss");
}
