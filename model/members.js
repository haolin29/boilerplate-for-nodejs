var mongose = require('mongose');
var memberSchema = new mongoose.Schema({
	MemberName: String,
	BasicInfo: String,
	SocialLink: {
		Github : String
		// ...
	}
	// to do
});

mongoose.model('memeber', memberSchema);

