import React from "react"
import { IOT_SERVER_URL }  from "../index"
export default class DeviceThumbnail extends React.Component {
    constructor(){
        super();
    }
    convertName (name) {
        let convertedName = "";
        for (let i = 0; i < name.length; i++) {
            if (name[i] != ' ') {
                convertedName += name[i].toLowerCase();
            }
        }

        return convertedName;
    }
    render() {
        return (
            <div class="col-md-4 portfolio-item">
                <div>
                    <a href="#">
                        <img class="img-responsive" width={ "700 "} height={ "500" } src={ "../../assets/imgs/" + this.convertName(this.props.name) + ".jpg"} alt="" />
                    </a>
                    <h3>
                        <a href={ IOT_SERVER_URL + "/api/devices/" + this.props.ipAddress }> { this.props.name} </a>
                    </h3>
                    <p>{ this.props.description } </p>
                    <p><code>{ this.props.ipAddress }</code></p>
                </div>
            </div>
        );
    }
}
