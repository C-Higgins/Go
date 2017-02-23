function unsubscribe(channelname) {
	App.cable.subscriptions.subscriptions.find((s) => {
		return JSON.parse(s.identifier).channel == channelname;
	}).unsubscribe();
}