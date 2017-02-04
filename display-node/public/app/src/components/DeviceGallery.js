import React from "react"
import DeviceThumbnail from "./DeviceThumbnail.js"

export default class DeviceGallery extends React.Component {
    constructor(){
        super();
    }

    render() {
        return (
            <div>

                <div class="row">
                    <div class="col-lg-12">
                        <h1 class="page-header">Devices
                            <small></small>
                        </h1>
                    </div>
                </div>

                <div class="row" >
                    <DeviceThumbnail name="SAMR-x21" description="this is awesome"/>
                </div>

            </div>
        );
    }
}
