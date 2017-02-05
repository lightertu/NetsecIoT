import React from "react"
import PageHeader from "./PageHeader"
export default class About extends React.Component {
    constructor(){
        super();
    }

    render(){
        return (
            <div class="container">
                <PageHeader name="about" description="cool"/>
            </div>
        );
    }
}