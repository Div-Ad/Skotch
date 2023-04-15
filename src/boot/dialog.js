import VuejsDialog from 'vuejs-dialog'
import 'vuejs-dialog/dist/vuejs-dialog.min.css';


export default ({ Vue }) => {
    Vue.use(VuejsDialog, { backdropClose: true })
};
