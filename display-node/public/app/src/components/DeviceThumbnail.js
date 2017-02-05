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
                        <img class="img-responsive" src="http://placehold.it/700x400" alt="" />
                    </a>
                    <h3>
                        <a href="#"> { this.props.name} </a>
                    </h3>
                    <p>{ this.props.description } </p>
                    <p>ip address:</p>
                </div>
            </div>
        );
    }
}
