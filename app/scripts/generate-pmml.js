 var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

function generate_transformations() {
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

	var xml = '<LocalTransformations>';

	$.each(transforms, function (index, element) {
		// This needs to be escaped properly:
		xml += '<!-- ' + element.expression + ' -->';
		xml += '<DerivedField ' + 
		  'name="' + element.name + '" ' +
		  'dataType="' + element.datatype + '" ' +
		  'optype="' + element.optype + '">';

		xml += parser.parse(element.expression);
		xml += '</DerivedField>'
	});

	xml += '</LocalTransformations>';

	return xml;
}

function generate_simple_predicate(rule) {
	return "<SimplePredicate field=\"" + rule['field'] + 
				"\" operator=\"" + rule['operator'] +
				"\" value=\"" + rule['value'] + "\"/>";	
}

function generate_compound_predicate(predicate) {
	if (!predicate.hasOwnProperty('rules')) {
		var xml = "";
	} else if (predicate['rules'].length == 1) {
		var xml = generate_simple_predicate(predicate['rules'][0]);
	} else {
		var xml = "<CompoundPredicate booleanOperator=\"" + predicate.condition + "\">";
		$.each(predicate.rules, function (index, element) {
			if (typeof element.rules != 'undefined') {
				xml += generate_compound_predicate(element);
			} else {
				xml += generate_simple_predicate(element);
			}
		})
		xml += "</CompoundPredicate>";
	}
	return xml;
}

function generate_rules() {
	var rules = getRules();
	var xml = "";

	$.each(rules, function(index, rule) {
		xml += "<SimpleRule score=\"" + rule.score +
				 "\" confidence=\"" + rule.confidence +
				 "\" weight=\"" + rule.weight + "\">" +
				 rule.predicate +
				 "</SimpleRule>";
	});

	return xml;
}

function generate_rule_set() {
	var xml = "";

	xml = "<RuleSet";

	if ($('input[name="defaultScore"]').val() != '') {
		xml += " defaultScore=\"" + $('input[name="defaultScore"]').val() + "\"";
	}

	if ($('input[name="defaultConfidence"]').val() != '') {
		xml += " defaultConfidence=\"" + $('input[name="defaultConfidence"]').val() + "\"";
	}

	xml += ">";

	$('input[name="criterion[]"]:checked').each(function(index, element) {
		xml += "<RuleSelectionMethod criterion=\"" + $(element).val() + "\"/>"
	})

	xml += generate_rules();

	xml += "</RuleSet>";

	return xml;
}

function generate_model() {
	var xml = "";

	xml = "<RuleSetModel modelName=\"" + $('input[name="modelName"]').val() +
			"\" functionName=\"classification\" algorithmName=\"RuleSet\">";

	xml += generate_transformations();

	xml += generate_rule_set();

	xml += "</RuleSetModel>";

	return xml;
}

function generate() {
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

	var datadictionary = '<DataDictionary>';
	$.each(dictionary, function (index, element) {
		datadictionary += '<DataField ' + 
		  'name="' + element.name + '" ' +
		  'dataType="' + element.datatype + '" ' +
		  'optype="' + element.optype + '"/>';
	});
	datadictionary += '</DataDictionary>';

	var pmml = '<PMML xmlns="http://www.dmg.org/PMML-4_2" version="4.2">' +
	           '<Header copyright="www.dmg.org" description="Sample scorecard">' +
               '<Timestamp>2010-11-10T08:17:10.8</Timestamp>' +
               '</Header>';

    pmml += datadictionary;

    

    pmml += generate_model();

    pmml += "</PMML>";

  pmml = vkbeautify.xml(pmml);
  pmml = escapeHtml(pmml);
  $('#generated-pmml').html(pmml).removeClass('prettyprinted');
  prettyPrint();
}

function removerow (event) {
	$(event.target).parent().parent().remove();
}

$('.removerow').click(removerow);

function adddictionaryrow (event) {
	var row = '<tr>' +
          '  <td><input type="text" name="dictionary[][name]" class="form-control" /></td>' +
          '  <td><select class="form-control" name="dictionary[][optype]">' +
          '    <option value="categorical">Categorical</option>' +
          '    <option value="ordinal">Ordinal</option>' +
          '    <option value="continuous">Continuous</option>' +
          '  </select></td>' +
          '  <td><select class="form-control" name="dictionary[][datatype]">' +
          '    <option value="string">String</option>' +
          '    <option value="integer">Integer</option>' +
          '    <option value="float">Float</option>' +
          '    <option value="double">Double</option>' +
          '    <option value="boolean">Boolean</option>' +
          '    <option value="date">Date</option>' +
          '    <option value="time">Time</option>' +
          '    <option value="dateTime">DateTime</option>' +
          '    <option value="dateDaysSince[0]">Days Since 0</option>' +
          '    <option value="dateDaysSince[1960]">Days Since 1960</option>' +
          '    <option value="dateDaysSince[1970]">Days Since 1970</option>' +
          '    <option value="dateDaysSince[1980]">Days Since 1980</option>' +
          '    <option value="timeSeconds">Seconds Since Midnight</option>' +
          '    <option value="dateTimeSecondsSince[0]">Seconds Since 0</option>' +
          '    <option value="dateTimeSecondsSince[1960]">Seconds Since 1960</option>' +
          '    <option value="dateTimeSecondsSince[1970]">Seconds Since 1970</option>' +
          '    <option value="dateTimeSecondsSince[1980]">Seconds Since 1980</option>' +
          '  </select></td>' +
          '  <td>' +
          '    <button type="button" class="btn btn-success btn-xs adddictionaryrow"><span class="glyphicon glyphicon-plus"></span></button>' +
          '    <button type="button" class="btn btn-danger btn-xs removerow"><span class="glyphicon glyphicon-minus"></span></button>' +
          '  </td>' +
          '</tr>';

	$(event.target).parent().parent().after(row);
	$('.adddictionaryrow', $(event.target).parent().parent().next()).click(adddictionaryrow);
	$('.removerow', $(event.target).parent().parent().next()).click(removerow);
	$("input[name='dictionary[][name]']", $(event.target).parent().parent().next()).change(attachQueryBuilder);
	$("select[name='dictionary[][datatype]']", $(event.target).parent().parent().next()).change(attachQueryBuilder);
}

$('.adddictionaryrow').click(adddictionaryrow);

function addtransformrow (event) {
	var row = '<tr>' +
              '  <td><input type="text" name="transforms[][name]" class="form-control" /></td>' +
              '  <td><select class="form-control" name="transforms[][optype]">' +
              '    <option value="categorical">Categorical</option>' +
              '    <option value="ordinal">Ordinal</option>' +
              '    <option value="continuous">Continuous</option>' +
              '  </select></td>' +
              '  <td><select class="form-control" name="transforms[][datatype]">' +
              '    <option value="string">String</option>' +
              '    <option value="integer">Integer</option>' +
              '    <option value="float">Float</option>' +
              '    <option value="double">Double</option>' +
              '    <option value="boolean">Boolean</option>' +
              '    <option value="date">Date</option>' +
              '    <option value="time">Time</option>' +
              '    <option value="dateTime">DateTime</option>' +
              '    <option value="dateDaysSince[0]">Days Since 0</option>' +
              '    <option value="dateDaysSince[1960]">Days Since 1960</option>' +
              '    <option value="dateDaysSince[1970]">Days Since 1970</option>' +
              '    <option value="dateDaysSince[1980]">Days Since 1980</option>' +
              '    <option value="timeSeconds">Seconds Since Midnight</option>' +
              '    <option value="dateTimeSecondsSince[0]">Seconds Since 0</option>' +
              '    <option value="dateTimeSecondsSince[1960]">Seconds Since 1960</option>' +
              '    <option value="dateTimeSecondsSince[1970]">Seconds Since 1970</option>' +
              '    <option value="dateTimeSecondsSince[1980]">Seconds Since 1980</option>' +
              '  </select></td>' +
              '  <td>' +
              '    <textarea name="transforms[][expression]" class="form-control" rows="3"></textarea>' +
              '  </td>' +
              '  <td>' +
              '    <button type="button" class="btn btn-success btn-xs addtransformrow"><span class="glyphicon glyphicon-plus"></span></button>' +
              '    <button type="button" class="btn btn-danger btn-xs removerow"><span class="glyphicon glyphicon-minus"></span></button>' +
              '  </td>' +
              '</tr>';

	$(event.target).parent().parent().after(row);
	$('.addtransformrow', $(event.target).parent().parent().next()).click(addtransformrow);
	$('.removerow', $(event.target).parent().parent().next()).click(removerow);
	$("input[name='transforms[][name]']", $(event.target).parent().parent().next()).change(attachQueryBuilder);
	$("select[name='transforms[][datatype]']", $(event.target).parent().parent().next()).change(attachQueryBuilder);
}

$('.addtransformrow').click(addtransformrow);

jQuery(function($) {
    $('.sortable').sortable({
        update: function() {
            $('.panel', panelList).each(function(index, elem) {
                 var $listItem = $(elem),
                     newIndex = $listItem.index();

                 // Persist the new indices.
            });
        }
    });
});
