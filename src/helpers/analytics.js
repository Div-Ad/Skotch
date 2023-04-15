import {uid} from "quasar";

export default {
	logEvent(category, action, label) {
		window.dataLayer.push({
			appEventCategory: category,
			appEventAction: action,
			appEventLabel: label,
			cid: this.getCid()
		})
		window.dataLayer.push({ 'event': 'appEvent' })
	},

	logPage(path, name) {
		window.dataLayer.push({
			screenPath: path,
			screenName: name,
			cid: this.getCid()
		})
		window.dataLayer.push({ 'event': 'appScreenView' })
	},

	getCid() {
		if (!localStorage.cid) {
			localStorage.cid = uid()
		}
		return localStorage.cid
	}
}