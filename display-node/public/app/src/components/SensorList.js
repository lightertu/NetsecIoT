/**
 * Created by rui on 2/11/17.
 */
import React from "react"
import ListItem from 'material-ui/List/ListItem';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import Chip from 'material-ui/Chip';

const styles = {
    chip: {
        margin: 4,
    },
};

export default class SensorList extends React.Component {
   constructor(){
       super();
   }

   render() {
       let device =  this.props.device;

       const sensorComponents = device.sensors.map((sensor) => {
           return (
               <ListItem
                   key={ sensor.name }
                   disabled={ true }
                   insetChildren={ true }
                   primaryText={ sensor.name }
                   rightAvatar={ <Chip style = { styles.chip } > 99F</Chip> }
               >
               </ListItem>
           );
       });

       return (
           <div>
               <ListItem
                   disabled={true}
                   leftAvatar={
                       <Avatar icon={ <FontIcon className="material-icons">memory</FontIcon> } />
                   }
               >
                   Sensors
               </ListItem>
               <Divider inset={true} />
               { sensorComponents }
           </div>
       );
   }
};
