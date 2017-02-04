var DeviceThumbNail = React.createClass({
    render: function() {
        return (
            <div class="row" >
                <div>
                    <a href={this.props.route}>
                        <img class="img-responsive" src={this.props.imageSrc} alt="">
                    </a>
                    <h3>
                        <a href={this.props.route}> {this.props.name}</a>
                    </h3>
                    <p> {this.props.description}</p>
                </div>
            </div>
        );
    }
});

module.exports = DeviceThumbNail;
