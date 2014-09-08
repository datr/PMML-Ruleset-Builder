
function attachQueryBuilder() {
  var dictionary = getDictionary();
  var transforms = getTransforms();
  var fields = dictionary.concat(transforms);
  var filters = [];

  var integer_types = ['integer', 'dateDaysSince[0]', 'dateDaysSince[1960]',
    'dateDaysSince[1970]', 'dateDaysSince[1980]', 'timeSeconds',
    'dateTimeSecondsSince[0]', 'dateTimeSecondsSince[1960]', 
    'dateTimeSecondsSince[1970]', 'dateTimeSecondsSince[1980]'];

  $.each(fields, function (index, item) {
    var type, input, values;

    if (item['name'] == "") {
      return;
    }

    input = 'text';

    if (item['datatype'] == "string") {
      type = "string";
    } else if($.inArray(item['datatype'], integer_types) >= 0) {
      type = 'integer';
    } else if (item['datatype'] == "float" || item['datatype'] == "double") {
      type = 'double';
    } else if (item['datatype'] == "boolean") {
      type = 'string';
      input = 'radio';
      values = {'true': 'True', 'false': 'False'};
    } else if (item['datatype'] == "date") {
      type = 'date';
    } else if (item['datatype'] == "time") {
      type = 'time';
    } else if (item['datatype'] == "dateTime") {
      type = 'datetime';
    }

    filters.push({
      'id' : item['name'],
      'type' : type,
      'input' : input,
      'values' : values
    });

  });

  var operators = [
    {
      'type' : 'equal',
      'accept_values' : true,
      'apply_to': ['string', 'number', 'datetime'],
      'sql': '='
    },
    {
      'type' : 'notEqual',
      'accept_values' : true,
      'apply_to': ['string', 'number', 'datetime'],
      'sql': '!='
    },
    {
      'type' : 'lessThan',
      'accept_values' : true,
      'apply_to': ['string', 'number', 'datetime'],
      'sql': '<'
    },
    {
      'type' : 'lessOrEqual',
      'accept_values' : true,
      'apply_to': ['string', 'number', 'datetime'],
      'sql': '<='
    },
    {
      'type' : 'greaterThan',
      'accept_values' : true,
      'apply_to': ['string', 'number', 'datetime'],
      'sql': '>'
    },
    {
      'type' : 'greaterOrEqual',
      'accept_values' : true,
      'apply_to': ['string', 'number', 'datetime'],
      'sql': '>='
    },
    {
      'type' : 'isMissing',
      'accept_values' : true,
      'apply_to': ['string', 'number', 'datetime'],
      'sql': ''
    },
    {
      'type' : 'isNotMissing',
      'accept_values' : true,
      'apply_to': ['string', 'number', 'datetime'],
      'sql': ''
    }
  ]

  $('.predicate-builder').each(function(index, element) {
  	$(element).queryBuilder('destroy');
  	$(element).queryBuilder({
      sortable: true,
      filters: filters,
      operators: operators,
      conditions: ['OR', 'AND', 'XOR'],
    });
  });
}

$("input[name='dictionary[][name]']").change(attachQueryBuilder);
$("select[name='dictionary[][datatype]']").change(attachQueryBuilder);
$("input[name='transforms[][name]']").change(attachQueryBuilder);
$("select[name='transforms[][datatype]']").change(attachQueryBuilder);

function addrule (event) {
  var rule = JST['app/partials/rule.hbs']();
  var target = $(event.target).parents('.panel');
  rule = $(rule).insertAfter(target);

  $('.add-rule', rule).click(addrule);
  $('.remove-rule', rule).click(removerule);

  var dictionary = getDictionary();
  var transforms = getTransforms();
  var fields = dictionary.concat(transforms);
  var filters = [];

  var integer_types = ['integer', 'dateDaysSince[0]', 'dateDaysSince[1960]',
    'dateDaysSince[1970]', 'dateDaysSince[1980]', 'timeSeconds',
    'dateTimeSecondsSince[0]', 'dateTimeSecondsSince[1960]', 
    'dateTimeSecondsSince[1970]', 'dateTimeSecondsSince[1980]'];

  $.each(fields, function (index, item) {
    var type, input, values;

    if (item['name'] == "") {
      return;
    }

    input = 'text';

    if (item['datatype'] == "string") {
      type = "string";
    } else if($.inArray(item['datatype'], integer_types) >= 0) {
      type = 'integer';
    } else if (item['datatype'] == "float" || item['datatype'] == "double") {
      type = 'double';
    } else if (item['datatype'] == "boolean") {
      type = 'string';
      input = 'radio';
      values = {'true': 'True', 'false': 'False'};
    } else if (item['datatype'] == "date") {
      type = 'date';
    } else if (item['datatype'] == "time") {
      type = 'time';
    } else if (item['datatype'] == "dateTime") {
      type = 'datetime';
    }

    filters.push({
      'id' : item['name'],
      'type' : type,
      'input' : input,
      'values' : values
    });

  });

  var operators = [
    {
      'type' : 'equal',
      'accept_values' : true,
      'apply_to': ['string', 'number', 'datetime'],
      'sql': '='
    },
    {
      'type' : 'notEqual',
      'accept_values' : true,
      'apply_to': ['string', 'number', 'datetime'],
      'sql': '!='
    },
    {
      'type' : 'lessThan',
      'accept_values' : true,
      'apply_to': ['string', 'number', 'datetime'],
      'sql': '<'
    },
    {
      'type' : 'lessOrEqual',
      'accept_values' : true,
      'apply_to': ['string', 'number', 'datetime'],
      'sql': '<='
    },
    {
      'type' : 'greaterThan',
      'accept_values' : true,
      'apply_to': ['string', 'number', 'datetime'],
      'sql': '>'
    },
    {
      'type' : 'greaterOrEqual',
      'accept_values' : true,
      'apply_to': ['string', 'number', 'datetime'],
      'sql': '>='
    },
    {
      'type' : 'isMissing',
      'accept_values' : true,
      'apply_to': ['string', 'number', 'datetime'],
      'sql': ''
    },
    {
      'type' : 'isNotMissing',
      'accept_values' : true,
      'apply_to': ['string', 'number', 'datetime'],
      'sql': ''
    }
  ]

  $('.predicate-builder', rule).queryBuilder({
    sortable: true,
    filters: filters,
    operators: operators,
    conditions: ['OR', 'AND', 'XOR'],
  });
}

function removerule (event) {
  $(event.target).parents('.panel').remove();
}

jQuery(function($) {
  var rule = JST['app/partials/rule.hbs']();
  rule = $(rule).insertAfter('#rules');
  $('.add-rule', rule).click(addrule);
  $('.remove-rule', rule).click(removerule);
})
