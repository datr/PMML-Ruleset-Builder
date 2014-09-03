/**
 * We try to group the operators that aren't going to appear together so that
 * we can optimising the parsing. This is based on the javascript example here:
 * https://github.com/dmajda/pegjs/blob/master/examples/javascript.pegjs
 *
 * The parser also needs to have caching enabled to be fast enough to work.
 *
 * Finally, we might want to consider the regex trick the javascript parser
 * uses to evaluate multiple operators at once to increase performance too.
 */

{
  function extractList(list, index) {
    var result = new Array(list.length), i;
    for (i = 0; i < list.length; i++) {
      result[i] = list[i][index];
    }
    return result;
  }

  function buildList(first, rest, index) {
    return [first].concat(extractList(rest, index));
  }
}

start
  = Expression

Expression
  = LogicalORExpression

PrimaryExpression
  = value
  / functions

/* Skipped */

__
  = (WhiteSpace / LineTerminatorSequence)*

WhiteSpace "whitespace"
  = "\t"
  / "\v"
  / "\f"
  / " "
  / "\u00A0"
  / "\uFEFF"
  / Zs

LineTerminatorSequence "end of line"
  = "\n"
  / "\r\n"
  / "\r"
  / "\u2028"
  / "\u2029"

// Separator, Space
Zs = [\u0020\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]

/* ----- Numeric Operators ----- */

/**
 * The arithmetic part is based on the example from the pegjs documentation:
 * http://pegjs.majda.cz/documentation#grammar-syntax-and-semantics
 *
 * However, we can probably improve the performance of this part by doing
 * something more like the arithmetic example:
 * https://github.com/dmajda/pegjs/blob/master/examples/arithmetics.pegjs
 */

additive
  = left:subtractive "+" right:additive { return "<Apply function=\"+\">" + left + right + "</Apply>"; }
  / subtractive

subtractive
  = left:multiplicative "-" right:subtractive { return "<Apply function=\"-\">" + left + right + "</Apply>"; }
  / multiplicative

multiplicative
  = left:divisive "*" right:multiplicative { return "<Apply function=\"*\">" + left + right + "</Apply>"; }
  / divisive

divisive
  = left:power "/" right:divisive { return "<Apply function=\"/\">" + left + right + "</Apply>"; }
  / power

power
  = left:PrimaryExpression "^" right:power { return "<Apply function=\"pow\">" + left + right + "</Apply>"; }
  / PrimaryExpression

equalityOperators
  = equal
  / notEqual
  / relational

equal
  = left:relational "==" right:relational { return "<Apply function=\"equal\">" + left + right + "</Apply>"; }

notEqual
  = left:relational "!=" right:relational { return "<Apply function=\"notEqual\">" + left + right + "</Apply>"; }

/* ----- Relational Operators ----- */

relational
  = lessThan
  / lessOrEqual
  / greaterThan
  / greaterOrEqual
  / additive

lessThan
  = left:additive "<" right:additive { return "<Apply function=\"lessThan\">" + left + right + "</Apply>"; }

lessOrEqual
  = left:additive "<=" right:additive { return "<Apply function=\"lessOrEqual\">" + left + right + "</Apply>"; }

greaterThan
  = left:additive ">" right:additive { return "<Apply function=\"greaterThan\">" + left + right + "</Apply>"; }

greaterOrEqual
  = left:additive ">=" right:additive { return "<Apply function=\"greaterOrEqual\">" + left + right + "</Apply>"; }

not
  = "!" expression:additive {return "<Apply function=\"not\">" + expression + "</Apply>"; }
  / additive

LogicalANDExpression
  = first:equalityOperators "&&" rest:LogicalANDExpression {return "<Apply function=\"and\">" + first + rest + "</Apply>"; }
  / equalityOperators

LogicalORExpression
  = first:LogicalANDExpression "||" rest:LogicalORExpression {return "<Apply function=\"and\">" + first + rest + "</Apply>"; }
  / LogicalANDExpression

/* ----- Functions ----- */

/**
 * We're including functions that have a set number of arguments and ones which
 * take an arbitrary number altogether for convenience at this point. Later on
 * it might be worth splitting this out or adding some validation somewhere else
 * that this is correct.
 */

functionnames
  = "log10" { return text(); }
  / "ln" { return text(); }
  / "sqrt" { return text(); }
  / "abs" { return text(); }
  / "exp" { return text(); }
  / "threshold" { return text(); }
  / "floor" { return text(); }
  / "ceil" { return text(); }
  / "round" { return text(); }
  / "min" { return text(); }
  / "max" { return text(); }
  / "sum" { return text(); }
  / "avg" { return text(); }
  / "median" { return text(); }
  / "product" { return text(); }
  / "isMissing" { return text(); }
  / "isNotMissing" { return text(); }
  / "isIn" { return text(); }
  / "isNotIn" { return text(); }
  / "if" { return text(); }
  / "uppercase" { return text(); }
  / "lowercase" { return text(); }
  / "substring" { return text(); }
  / "trim" { return "trimBlanks"; }
  / "concat" { return text(); }
  / "replace" { return text(); }
  / "matches" { return text(); }
  / "formatNumber" { return text(); }
  / "formatDatetime" { return text(); }
  / "dateDaysSinceYear" { return text(); }
  / "dateSecondsSinceYear" { return text(); }
  / "dateSecondsSinceMidnight" { return text(); }

functions
 = name:functionnames "(" __ first:start rest:(__ "," __ start)* ")" {
   	 return "<Apply function=\"" + name + "\">" + buildList(first, rest, 3).join('') + "</Apply>";
   }
 / "(" expression:start ")" { return expression; }

/**
 * The value parsers are based on the json example:
 * https://github.com/dmajda/pegjs/blob/master/examples/json.pegjs
 */

/* ----- 3. Values ----- */

value
  = field
    / false
    / true
    / number
    / string

field
  = "$" name:[A-Za-z0-9]+ { return "<FieldRef field=\"" + name.join("") + "\"/>"; }

false = "false" { return "<Constant dataType=\"boolean\">false</Constant>"; }
true = "true" { return "<Constant dataType=\"boolean\">true</Constant>"; }

/* ----- 6. Numbers ----- */

number "number"
  = minus? int frac? { return "<Constant>" + text() + "</Constant>"; }

decimal_point = "."
digit1_9 = [1-9]
frac = decimal_point DIGIT+
int = zero / (digit1_9 DIGIT*)
minus = "-"
plus = "+"
zero = "0"

/* ----- 7. Strings ----- */

string "string"
  = quotation_mark chars:char* quotation_mark { return "<Constant dataType=\"string\">" + chars.join("") + "</Constant>"; }

char
  = unescaped

quotation_mark = '"'
unescaped = [\x20-\x21\x23-\x5B\x5D-\u10FFFF]

/* ----- Core ABNF Rules ----- */
/* See RFC 4234, Appendix B (http://tools.ietf.org/html/rfc4627). */
DIGIT = [0-9]