/**
 * Created by rui on 2/4/17.
 */
import React from "react"
export default class DeviceGalleryHeader extends React.Component {
    constructor(){
        super();
    }
    render() {
        return (
            <div class="row">
                <div class="col-lg-12">
                    <h1 class="page-header"> { this.props.name }
                        <small> { this.props.description }</small>
                    </h1>
                </div>
            </div>
        );
    }
}
