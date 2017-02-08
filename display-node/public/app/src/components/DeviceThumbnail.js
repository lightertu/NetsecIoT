import React from "react"
export default class DeviceThumbnail extends React.Component {
    constructor(){
        super();
    }
    render() {
        return (
            <div class="col-md-4 portfolio-item">
                <div>
                    <a href="#">
                        <img class="img-responsive" width={ "700 "} height={ "500" } src={ "../../assets/imgs/" + this.props.name + ".jpg"} alt="" />
                    </a>
                    <h3>
                        <a href={ "http://localhost:8080/api/devices/" + this.props.ipAddress }> { this.props.name} </a>
                    </h3>
                    <p>{ this.props.description } </p>
                    <p><code>{ this.props.ipAddress }</code></p>
                </div>
            </div>
        );
    }
}
