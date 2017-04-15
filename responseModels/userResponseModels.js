var modelForAllUsers = {
	'name' 				: true,
 	'age'				: true,
 	'photoURL'			: true
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
 	modelForAllUsers : modelForAllUsers,
 	modelForAdmins : modelForAdmins
  };