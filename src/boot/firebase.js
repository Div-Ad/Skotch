import Vue from 'vue'
import { initializeApp } from 'firebase/app'
import {getAuth} from "firebase/auth";

const firebase = initializeApp({
		apiKey: process.env.FIREBASE_APIKEY,
		authDomain: process.env.FIREBASE_AUTHDOMAIN,
		databaseURL: process.env.FIREBASE_DATABASEURL,
		projectId: process.env.FIREBASE_PROJECTID,
		storageBucket: process.env.FIREBASE_STORAGEBUCKET,
		messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
		appId: process.env.FIREBASE_APPID,
		measurementId: process.env.FIREBASE_MEASUREMENTID
	}
)
Vue.prototype.$firebase = firebase

const auth = getAuth(firebase)

export { firebase, auth }
