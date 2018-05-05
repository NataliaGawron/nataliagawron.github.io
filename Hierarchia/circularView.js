queue()
    .defer(d3.csv, 'sampleData.csv')
    .await(ready);

var height = document.getElementById('tree-container').offsetHeight;
var width = document.getElementById('tree-container').offsetWidth;
var avatarRadius = 20;
var translateOffset = 25;
var radius = d3.min([height, width]) / 2;
var cluster = d3.layout.cluster().size([360, radius / 1.33]);
// .separation(function(a,b){return (a.parent == b.parent ? 1:2)/a.depth;});

var svg = d3
    .select('#tree-container')
    .append('svg')
    .attr('width', radius * 2)
    .attr('height', radius * 2)
    .attr('id', 'tree-container-svg')
    .append('g')
    .attr('transform', 'translate(' + radius + ',' + height / 2 + ')');

// Wymagana ścieżka klipu dla okrągłych awatarów svg
var defs = svg.append('defs');
var clipPath = defs
    .append('clipPath')
    .attr('id', 'clip-circle')
    .append('circle')
    .attr('r', avatarRadius - 2.5);

var diagonal = d3.svg.diagonal.radial().projection(function(d) {
    return [d.y, d.x / 180 * Math.PI];
});

d3.selection.prototype.moveToFront = function() {
    return this.each(function() {
        this.parentNode.appendChild(this);
    });
};

d3.selection.prototype.moveToBack = function() {
    return this.each(function() {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
};

//http://www.d3noob.org/2014/01/tree-diagrams-in-d3js_11.html
function treeify(list, callback) {
    var dataMap = list.reduce(function(map, node) {
        map[node.Associate] = node;
        return map;
    }, {});

    var treeData = [];
    list.forEach(function(node) {
        // Zakładając, że najwyższy węzeł jest ostatnim w pliku csv
        if (node.Manager === node.Associate) {
            node.Manager = 'Board of Directors';
            callback(node);
        }
        // dodaj do nadrzędnego
        var parent = dataMap[node.Manager];

        if (parent) {
            // utwórz tablicę, jeśli nie istnieje
            (parent.children || (parent.children = []))
            // dodaj węzeł do tablicy 
            .push(node);
        } else {
            // rodzic ma wartość null lub brakuje go
            treeData.push(node);
        }
    });
}

function findItem(root, name, callback) {
    var stack = [];
    stack.push(root);
    while (stack.length !== 0) {
        var element = stack.pop();
        if (element.Associate === name) {
            callback(element);
            return;
        }
        //górny (skompresowany) case
        else if (element.children !== undefined && element.children.length > 0) {
            for (var i = 0; i < element.children.length; i++) {
                stack.push(element.children[i]);
            }
        }
        // dolny (skompresowany) case
        else if (element._children !== undefined && element._children.length > 0) {
            for (var j = 0; j < element._children.length; j++) {
                stack.push(element._children[j]);
            }
        }
    }
}

function defaultPlot(root, elem) {
    findItem(root, elem, function(d) {
        // Pokazuje 1 w górę i poniżej
        findItem(root, d.Manager, function(x) {
            x.children ? x.children.forEach(collapse) : (x.children = x._children);
            drawIt(x, root);
        });
    });
}

function collapse(d) {
    if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = undefined;
    }
}

// Dla błędnego przejścia z wieloma węzłami
function showAllCurrentPathsAndNodes() {
    d3.selectAll('.link').style('opacity', 1);
    d3.selectAll('.node').style('opacity', 1);
}


28 / 5000
    // Przełącz dzieci na kliknięciem
function clickedNode(d, root) {
    // zanotowanie błędu przejścia na opóźnienie
    showAllCurrentPathsAndNodes();

    if (d.children) {
        d._children = d.children;
        d.children = undefined;
        drawIt(root);
    } else {
        d.children = d._children;
        d._children = undefined;
        drawIt(root);
    }
}

//http://bl.ocks.org/syntagmatic/4092944
function drawIt(root) {
    var nodes = cluster.nodes(root);
    var maxDepth = d3.max(nodes, function(d) {
        return d.depth;
    });
    var link = svg.selectAll('path.link').data(cluster.links(nodes));
    //ważne wywołanie dla wzorca aktualizacji
    var node = svg.selectAll('g.node').data(nodes, function(d) {
        return d.Associate;
    });

    link
        .transition()
        .duration(1000)
        .attr('d', diagonal);

    d3.selectAll('.node-cicle').classed('highlight', false);

    showAllCurrentPathsAndNodes();

    link
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', diagonal)
        .attr('', function(d) {
            d3.select(this).moveToBack();
        })
        .style('opacity', 0)
        .transition()
        .duration(300)
        .delay(function(d, i) {
            return 25 * i;
        })
        .style('opacity', 1);

    node
        .transition()
        .duration(800)
        .attr('transform', function(d) {
            return 'rotate(' + (d.x - 90) + ')translate(' + d.y + ')';
        });

    var g = node
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', function(d) {
            return 'rotate(' + (d.x - 90) + ')translate(' + d.y + ')';
        })
        .style('opacity', 0)
        .style('cursor', function(d) {
            return (d._children || d.children) && d.Manager !== 'Board of Directors' ? 'pointer' : 'not-allowed';
        })
        .on('mouseover', function() {
            d3.select(this).moveToFront();
        });

    //ponowne przypisanie detektora zdarzeń dla wszystkich węzłów przy każdym losowaniu
    d3.selectAll('.node').on('click', function(d) {
        return (d._children || d.children) && d.Manager !== 'Board of Directors' ? clickedNode(d, root) : '';
    });

    g
        .transition()
        .duration(300)
        .delay(function(d, i) {
            return 65 * i;
        })
        .style('opacity', 1);

    g
        .append('circle')
        .attr('r', avatarRadius)
        .attr('class', 'circle-marker')
        .style('stroke', function(d) {
            return (d._children || d.children) && d.Manager !== 'Board of Directors' ? 'fffa00' : 'white'; //kolory borderów avatarów
        })
        .style('fill', function(d) {
            return (d._children || d.children) && d.Manager !== 'Board of Directors' ? 'ff5a00' : 'ff5a00';
        });

    g
        .append('svg:image')
        .attr('class', 'node-avatar')
        .attr('xlink:href', 'user.png')
        .attr('height', avatarRadius * 2)
        .attr('width', avatarRadius * 2)
        .attr('x', '-' + avatarRadius)
        .attr('y', '-' + avatarRadius)
        .attr('clip-path', 'url(#clip-circle)');

    d3.selectAll('.node-avatar').attr('transform', function(d) {
        return 'rotate(' + -1 * (d.x - 90) + ')'; //rotacja avatara, by był w pionie
    });

    g
        .append('text')
        .attr('dy', '.331em')
        .attr('class', 'label-text')
        .text(function(d) {
            return d.Associate;
        });

    // przeszukuj wszystkie etykiety, aby upewnić się, że są one prawą stroną do góry
    d3
        .selectAll('.label-text')
        .attr('text-anchor', function(d) {
            return d.x < 180 ? 'start' : 'end';
        })
        .attr('transform', function(d) {
            return d.x < 180 ? 'translate(' + translateOffset + ')' : 'rotate(270)translate(-' + translateOffset + ')'; //translacja napisu label-text
        });

    link
        .exit()
        .transition()
        .duration(0)
        .style('opacity', 0)
        .remove();
    node
        .exit()
        .transition()
        .duration(0)
        .style('opactiy', 0)
        .remove();
}

function ready(error, data) {
    if (error) throw error;
    treeify(data, function(treeReturn) {
        var root = treeReturn;
        defaultPlot(root, root.children[0].Associate);
    });
}