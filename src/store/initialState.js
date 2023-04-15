const initialState = {
	user: {
		id: null,
		acceptFriendsRequest: true,
		email: '',
		firstname: '',
		lastname: '',
		photobase64: '',
		photourl: '',
		first_step: false,
		devices: { tokens: [] },
		is_loading: false,
		params: {
			help: {
				ob0: false,
				ob1: false,
				ob2: false,
				ob3: false,
				ob4: false,
				ob5: false,
				ob6: false,
				ob7: false,
				ob8: false,
				ob9: false
			}
		}
	},
	skotchs: [],
	suggestions: [],
	feedbacks: [],
	skotchLists: [],
	skotchListsCatalog: [],
	friends: [],
	notifications: {
		feedback: [],
		request: [],
		requested: [],
		suggestion: [],
		hint: []
	},
	thumbnail: false,
	loginData: null,
	token: '',
	authTokenExpirationTime: null,
	notificationDisplay: false,
	messagingToken: '',
	isLoggedIn: false,
}

export default initialState