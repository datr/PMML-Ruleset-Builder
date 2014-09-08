function getDictionary() {
  var dictionary = [];

  $('input[name="dictionary[][name]"]').each(function (index, element) {
    dictionary[index] = {'name' : $(element).val()};
  });

  $('select[name="dictionary[][optype]"]').each(function (index, element) {
    dictionary[index]['optype'] = $(element).val();
  });

  $('select[name="dictionary[][datatype]"]').each(function (index, element) {
    dictionary[index]['datatype'] = $(element).val();
  });

  return dictionary;
}

function getTransforms() {
	var transforms = [];

	$('input[name="transforms[][name]"]').each(function (index, element) {
		transforms[index] = {'name' : $(element).val()};
	});

	$('select[name="transforms[][optype]"]').each(function (index, element) {
		transforms[index]['optype'] = $(element).val();
	});

	$('select[name="transforms[][datatype]"]').each(function (index, element) {
		transforms[index]['datatype'] = $(element).val();
	});

	$('textarea[name="transforms[][expression]"]').each(function (index, element) {
		transforms[index]['expression'] = $(element).val();
	});

	return transforms;
}

function getRules() {
	var rules = [];

	$('input[name="rules[][score]"]').each(function (index, element) {
		rules[index] = {'score' : $(element).val()};
	});

	$('input[name="rules[][confidence]"]').each(function (index, element) {
		rules[index]['confidence'] = $(element).val();
	});

	$('input[name="rules[][weight]"]').each(function (index, element) {
		rules[index]['weight'] = $(element).val();
	});

	$('.predicate-builder').each(function (index, element) {
		var predicate = $(element).queryBuilder('getRules');
		console.log(predicate);
		rules[index]['predicate'] = generate_compound_predicate(predicate);
	});

	return rules;
}