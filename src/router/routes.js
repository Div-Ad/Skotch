import Dashboard from '../views/Dashboard'
import Signin from '../views/security/SignIn'
import TodolistSelect from '../views/skotch/SkotchListCatalog'
import TodoList from '../views/skotch/SkotchList'
import Tos from '../views/settings/Tos'
import Privacy from '../views/settings/Privacy'
import Config from '../views/settings/Config'
import FirstSteps from '../views/settings/FirstSteps'
import Contact from '../views/contact/Contact'
import QuickCreate from '../views/skotch/QuickCreate'
import ContactSearch from '../views/contact/ContactSearch'
import ContactDetails from '../views/contact/ContactDetails'
import Reset from "src/views/security/Reset"
import Loading from "src/views/Loading"
import ShareTarget from "src/views/skotch/ShareTarget"
import EmailVerification from "src/views/security/EmailVerification"

const routes = [
	{
		path: '/',
		redirect: '/signin'
	},
	{
		path: '/signin',
		name: 'signin',
		component: Signin
	},
	{
		path: '/reset',
		name: 'reset',
		component: Reset
	},
	{
		path: '/email-verification',
		name: 'email-verification',
		component: EmailVerification,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/loading',
		name: 'loading',
		component: Loading,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/dashboard',
		name: 'dashboard',
		component: Dashboard,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/friends',
		name: 'friends',
		component: Contact,
		meta: {
			requiresAuth: true
		},
		children: [
			{
				path: 'search',
				name: 'search-friends',
				component: ContactSearch
			}
		]
	},
	{
		path: '/config',
		name: 'config',
		component: Config,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/first-steps',
		name: 'first-steps',
		component: FirstSteps,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/skotch-list-catalog',
		name: 'skotch-list-catalog',
		component: TodolistSelect,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/quick-create',
		name: 'quick-create',
		component: QuickCreate,
		meta: {
			requiresAuth: true
		},
		props: true
	},
	{
		path: '/share-target',
		name: 'share-target',
		component: ShareTarget,
		meta: {
			requiresAuth: true
		},
		props: route => ({
			title: route.query.title,
			text: route.query.text,
			url: route.query.url
		})
	},
	{
		path: '/skotch-list/:skotchListName',
		name: 'skotch-list',
		component: TodoList,
		meta: {
			requiresAuth: true
		},
		props: true
	},
	{
		path: '/bookmarked',
		name: 'bookmarked',
		component: TodoList,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/friend/',
		name: 'friend',
		component: ContactDetails,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/tos',
		name: 'tos',
		component: Tos,
		meta: {
			requiresAuth: false
		}
	},
	{
		path: '/privacy',
		name: 'privacy',
		component: Privacy,
		meta: {
			requiresAuth: false
		}
	}
]

export default routes
