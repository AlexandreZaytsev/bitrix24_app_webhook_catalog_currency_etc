//---------------------------------------------------------------------------------------------------------
/* repeatString() returns a string which has been repeated a set number of times */
function repeatString(str, num) {
    let out = '';
    for (var i = 0; i < num; i++) {
        out += str;
    }
    return out;
}

/*
dump() displays the contents of a variable like var_dump() does in PHP. dump() is
better than typeof, because it can distinguish between array, null and object.
Parameters:
    v:              The variable
    howDisplay:     "none", "body", "alert" (default)
    recursionLevel: Number of times the function has recursed when entering nested
                    objects or arrays. Each level of recursion adds extra space to the
                    output to indicate level. Set to 0 by default.
Return Value:
    A string of the variable's contents
Limitations:
    Can't pass an undefined variable to dump(). 
    dump() can't distinguish between int and float.
    dump() can't tell the original variable type of a member variable of an object.
    These limitations can't be fixed because these are *features* of JS. However, dump()
*/
function dump(v, howDisplay, recursionLevel) {
    howDisplay = (typeof howDisplay === 'undefined') ? "alert" : howDisplay;
    recursionLevel = (typeof recursionLevel !== 'number') ? 0 : recursionLevel;

    var vType = typeof v;
    var out = vType;

    switch (vType) {
        case "number":
        /* there is absolutely no way in JS to distinguish 2 from 2.0
           so 'number' is the best that you can do. The following doesn't work:
           var er = /^[0-9]+$/;
           if (!isNaN(v) && v % 1 === 0 && er.test(3.0)) {
               out = 'int';
           }
        */
        break;
    case "boolean":
        out += ": " + v;
        break;
    case "string":
        out += "(" + v.length + '): "' + v + '"';
        break;
    case "object":
        //check if null
        if (v === null) {
            out = "null";
        }
        //If using jQuery: if ($.isArray(v))
        //If using IE: if (isArray(v))
        //this should work for all browsers according to the ECMAScript standard:
        else if (Object.prototype.toString.call(v) === '[object Array]') {
            out = 'array(' + v.length + '): {\n';
            for (var i = 0; i < v.length; i++) {
                out += repeatString('   ', recursionLevel) + "   [" + i + "]:  " +
                    dump(v[i], "none", recursionLevel + 1) + "\n";
            }
            out += repeatString('   ', recursionLevel) + "}";
        }
        else {
            //if object
            let sContents = "{\n";
            let cnt = 0;
            for (var member in v) {
                //No way to know the original data type of member, since JS
                //always converts it to a string and no other way to parse objects.
                sContents += repeatString('   ', recursionLevel) + "   " + member +
                    ":  " + dump(v[member], "none", recursionLevel + 1) + "\n";
                cnt++;
            }
            sContents += repeatString('   ', recursionLevel) + "}";
            out += "(" + cnt + "): " + sContents;
        }
        break;
    default:
        out = v;
        break;
    }

    if (howDisplay == 'body') {
        var pre = document.createElement('pre');
        pre.innerHTML = out;
        document.body.appendChild(pre);
    }
    else if (howDisplay == 'alert') {
        alert(out);
    }

    return out;
}

/**
 * Разложить массив в виде дерева рекурсивно
 * @param  {array} obj Массив параметров запросов
 * @return {string} форматированная (html) строка
 */
function tree(obj, $tab = "", $result = "") {
//	showProgressBar(0);
//	let counter=0;
//	let total=obj.length;	
	for (var k in obj) {
		if (obj[k] instanceof Object) {
			$result += $tab + "[" + k + "] <i style='color:red;'>(array)</i><br>";
			$result += tree(obj[k], $tab + "&nbsp;".repeat(4));
		} else {
			$result += $tab + "[" + k + "] => <b>" + obj[k] + "</b><br>";
		}
		
//		counter+=1;
//		total > 0 ? showProgressBar(Math.round(100 * counter / total)) : showProgressBar(100)
	}
//	showProgressBar(100);
	return $result;
}

/**
 * Выбрать метод отображения результата
 * @param  {array} data Массив параметров запросов
 * @param  {int} mode Режим работы
 * @return {string} форматированная (html) строка
 */
function printResult(data, mode=1){
	switch (mode){
		case 0:
			return tree(data);
			break;
		case 1:
			return '<pre>'+ JSON.stringify(data, null, 2)+'</pre>';
			break;
		case 2:
			return '<pre>'+dump(data,'none')+'</pre>';
			break;
	}
}
//---------------------------------------------------------------------------------------------------------