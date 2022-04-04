
// /**
//  * Class that handles the event where a location on the map is clicked
//  */
// class GIS extends Autodesk.Viewing.ToolInterface {

//     /**
//      * Default constructor to initialise tool with super call
//      * to ToolInterface constructor
//      */
//     constructor() {
//         super();
//         this.names = ['gis-tool'];

//         //We want the tool controller to handle the below events
//         //not the instance of the GIS tool
//         delete this.register;
//         delete this.unregister;
//         delete this.activate;
//         delete this.deactivate;
//         delete this.handleSingleClick;
//     }

//     /**
//      * Logging that the tool has been realised
//      */
//     register() {
//         console.log('GIS tool registered');
//     }

//     /**
//      * Logging that the tool has been unloaded
//      */
//     unregister() {
//         this.viewer.unloadExtension('Autodesk.Geolocation');
//         console.log('GIS tool unregistered');
//         this.geoTool = null;
//     }

//     /**
//      * Method to get the x,y,z map of the revit file. Method also logs
//      * when the button is active
//      * 
//      * @param {*} name - Name passed to viewer.loadExtension 
//      * @param {*} viewer - The viewer that the revit file is shown in
//      */
//     async activate(name, viewer) {
//         this.viewer = viewer;

//         //get the geolocation extension for the viewer
//         this.geoTool = await this.viewer.loadExtension('Autodesk.Geolocation');

//         //if theres not geolocation data in the revit file (i.e., its empty)
//         if (!this.geoTool.hasGeolocationData())
//             alert('No x,y,z data found for revit file');

//         console.log('GIS tool button active');
//     }

//     /**
//      * Method to log that the tool buttonhas been deactivated
//      */
//     deactivate() {
//         console.log('GIS tool button deactivate');
//     }

//     /**
//      * Method to handle a click on the revit model
//      * 
//      * @param {*} event - The button click
//      * @param {*} button - The GIS tool button
//      * @returns 
//      */
//     handleSingleClick(event, button) {
//         if (button === 0) {
//             //The x,y location of the event
//             const canvasX = event.canvasX;
//             const canvasY = event.canvasY;
//             //Getting the z location based on the x,y (absolute z position)
//             const res = this.viewer.clientToWorld(canvasX, canvasY);
//             //Mapping the z location to the revit model (relative z position)
//             const geolocation = this.geoTool.lmvToLonLat(res.point);
//             // console.log(JSON.stringify(res.point)); //prints the absoulte x,y,z positon; not what we want
//             console.log(JSON.stringify(geolocation)); //prints the relative x,y,z position; what we want
//             return true; 
//         }
//         //if the button is not active (i.e., pressed)
//         return false;
//     }
// }

// /**
//  * Class to onboard the GIS tool extension
//  */
// class GISExtension extends Autodesk.Viewing.Extension {
//     /**
//      * Default constructor
//      * @param {*} viewer - The viewer that the revit file is shown in
//      * @param {*} options - The options for the toolbar
//      */
//     constructor(viewer, options) {
//         super(viewer, options);
//         this.tool = new GIS();
//     }

//     /**
//      * Registering the GIS tool to the viewer controller
//      * @returns 
//      */
//     load() {
//         this.viewer.toolController.registerTool(this.tool);
//         // var loader = new Loader;
//         // loader.start();
//         console.log('GIS Extension loaded');
//         return true;
//     }

//     /**
//      * Unregistering the GIS tool from the viewer controller
//      * @returns 
//      */
//     unload() {
//         this.viewer.toolController.unregisterTool(this.tool);
//         console.log('GIS Extension unloaded');
//         return true;
//     }

//     /**
//      * Method to add the button to the toolbar once the toolbar 
//      * has been created
//      * @param {*} toolbar - The Autodesk Forge Viewer toolbar
//      */
//     onToolbarCreated(toolbar) {
//         //Viewer controller for the GIS tool
//         const controller = this.viewer.toolController;
//         //Initialising the GIS tool button
//         this.button = new Autodesk.Viewing.UI.Button('gis-tool-button');
//         this.button.onClick = (ev) => {
//             const isActivated = controller.isToolActivated('gis-tool');
//             //If the button has been pressed in ACTIVE state
//             if (isActivated) {
//                 //Stop the GIS tool from working
//                 controller.deactivateTool('gis-tool');
//                 //Set status to INACTIVE
//                 this.button.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
//             }
//             //If the button has been pressed in INACTIVE state 
//             else {
//                 //Activate the GIS tool
//                 controller.activateTool('gis-tool');
//                 this.button.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);
//             }
//         };

//         this.button.setToolTip('GIS Tool');
//         this.button.addClass('GISToolIcon');
//         this.group = new Autodesk.Viewing.UI.ControlGroup('gis-tool-group');
//         //Adding the button to the controllers elements
//         this.group.addControl(this.button);
//         //Add group to elements
//         toolbar.addControl(this.group);
//     }
// }
// Autodesk.Viewing.theExtensionManager.registerExtension('GISExtension', GISExtension);

class GisTool extends Autodesk.Viewing.ToolInterface {
    constructor() {
        super();
        this.names = ['gis-tool'];
 
        // Hack: delete functions defined *on the instance* of the tool.
        // We want the tool controller to call our class methods instead.
        delete this.register;
        delete this.deregister;
        delete this.activate;
        delete this.deactivate;
        delete this.getPriority;
        delete this.handleSingleClick;
    }
 
    register() {      
      console.log('GisTool registered.');
    }
 
    deregister() {
      this.viewer.unloadExtension('Autodesk.Geolocation');
      this.geoTool = null;
      console.log('GisTool unregistered.');
    }
 
    async activate(name, viewer) {
      this.viewer = viewer;
      this.geoTool = await this.viewer.loadExtension('Autodesk.Geolocation');

      if (!this.geoTool.hasGeolocationData())
        alert( 'No GIS data found in current model' );

      console.log('GisTool activated.');
    }
 
    deactivate(name) {
      console.log('GisTool deactivated.');
    }
 
    getPriority() {
      return 1; // Or feel free to use any number higher than 0 (which is the priority of all the default viewer tools)
    }
 
    handleSingleClick(event, button) {
      if (button === 0 ) {
        // const hitPoint = this._intersect(event.clientX, event.clientY);
        // const geolocation = this.geoTool.lmvToLonLat(hitPoint);
        const canvasX = event.canvasX;
        const canvasY = event.canvasY;
        const res = this.viewer.clientToWorld(canvasX, canvasY);
        const geolocation = this.geoTool.lmvToLonLat(res.point);
        console.log(JSON.stringify(res.point));
        console.log(JSON.stringify(geolocation)); //!<<< the geolocation you want
        return true; // Stop the event from going to other tools in the stack
      }
      // Otherwise let another tool handle the event
      return false;
    }

    _intersect(clientX, clientY) {
      return this.viewer.impl.intersectGround(clientX, clientY);
    }
  }

  class GisToolExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
      super(viewer, options);
      this.tool = new GisTool();
    }
 
    load() {
      this.viewer.toolController.registerTool(this.tool);
      console.log('GisToolExtension loaded.');
      return true;
    }
 
    unload() {
      this.viewer.toolController.deregisterTool(this.tool);
      console.log('GisToolExtension unloaded.');
      return true;
    }
 
    onToolbarCreated(toolbar) {
      const controller = this.viewer.toolController;
      this.button = new Autodesk.Viewing.UI.Button('gis-tool-button');
      this.button.onClick = (ev) => {
          const isActivated = controller.isToolActivated('gis-tool');
          if (isActivated) {
            controller.deactivateTool('gis-tool');
            this.button.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
          } else {
              controller.activateTool('gis-tool');
              this.button.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);
          }
      };
      this.button.setToolTip('GIS Tool');

      this.group = new Autodesk.Viewing.UI.ControlGroup('gis-tool-group');
      this.group.addControl(this.button);
      toolbar.addControl(this.group);
    }
  }
  Autodesk.Viewing.theExtensionManager.registerExtension('GisToolExtension', GisToolExtension);
