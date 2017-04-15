var modelForAllUsers = {
	'name' 				: true,
 	'age'				: true,
 	'photoURL'			: true
 };

 var modelForUserProfile = {
	'email'				: true,
	'name' 				: true,
 	'age'				: true,
 	'city'				: true,
 	'sportsCategories'	: true,
 	'photoURL'			: true,
 	'participatedEvents': true,
 	'events'			: true,
 	'friends'			: true
 };

 var modelForProfileOwner = {
	'email'				: true,
	'name' 				: true,
 	'age'				: true,
 	'birthDate'			: true,
 	'city'				: true,
 	'sportsCategories'	: true,
 	'photoURL'			: true,
 	'participatedEvents': true,
 	'events'			: true,
 	'friends'			: true
 };

 var modelForAdmins = {
	'email'				: true,
	'name' 				: true,
 	'password'			: true,
 	'age'				: true,
 	'birthDate'			: true,
 	'city'				: true,
 	'sportsCategories'	: true,
 	'admin'				: true,
 	'photoURL'			: true,
 	'participatedEvents': true,
 	'events'			: true,
 	'friends'			: true
 };

 module.exports = { 
 	modelForAllUsers 		: modelForAllUsers,
 	modelForAdmins 			: modelForAdmins,
 	modelForUserProfile 	: modelForUserProfile,
 	modelForProfileOwner 	: modelForProfileOwner
  };