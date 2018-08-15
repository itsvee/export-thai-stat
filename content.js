chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.method == "getDataTable"){
            var i = 0;
            var dataArray = [];
            var itemArray = {};
            var filestr = $('#detail p:first').text() + $('#detail p:nth-child(2)').text();
            var removeTitle = filestr.replace(/จำนวนประชากรแยกรายอายุ  /g , '');
            var filename = removeTitle.replace('เดือน ธันวาคม ' , '_');
            console.log(filename);
            $('table table table > tbody  > tr').each(function() {
                if(i != 0) {
                    var j = 1;
                    $(this).find('td').each(function() {
                        var cellText = $(this).text();
                        if (j == 1 || j == 5) {
                            itemArray["Age"] = cellText.replace(/,/g , '');
                        } else if (j == 2 || j == 6) {
                            itemArray["Man"] = cellText.replace(/,/g , '');
                        } else if (j == 3 || j == 7) {
                            itemArray["Woman"] = cellText.replace(/,/g , '');
                        }else if (j == 4 || j == 8) {
                            itemArray["Total"] = cellText.replace(/,/g , '');
                        }
                        if((j % 4) == 0) {
                            dataArray.push(itemArray);
                            itemArray = {};
                        }
                        j++;
                    });
                }
                i++;
            });
            downloadCSV(dataArray, filename);
        }
    }
);

function downloadCSV(dataArray , name) {
    var data, filename, link;
    var csv = convertArrayOfObjectsToCSV({
        data: dataArray
    });
    if (csv == null) return;

    filename = name+'.csv' || 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}

function convertArrayOfObjectsToCSV(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function(item) {
        ctr = 0;
        keys.forEach(function(key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}