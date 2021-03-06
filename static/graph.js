function renderGraph(json) {
  var svg = d3.select('svg'),
    width = +svg.attr('width'),
    height = +svg.attr('height');

  var color = d3.scaleOrdinal(d3.schemeCategory20);
  var simulation = d3
    .forceSimulation()
    .force(
      'link',
      d3
        .forceLink()
        .id(function(d) {
          return d.id;
        })
        .distance(function(d) {
          return 100 - Math.abs(d.coefficient);
        })
    )
    .force('charge', d3.forceManyBody().strength(-150))
    .force('collide', d3.forceCollide().radius(12))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('y', d3.forceY(0))
    .force('x', d3.forceX(0));

  d3.json('correlation.json', function(error, graph) {
    if (error) throw error;

    var link = svg
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(graph.links)
      .enter()
      .append('line')
      .attr('stroke-width', function(d) {
        return Math.abs(d.coefficient) / 5 > 2
          ? Math.abs(d.coefficient) / 5
          : 2;
      })
      .attr('stroke-opacity', 0.6)
      .attr('stroke', function(d) {
        if (d.coefficient > 0) return 'green';
        else return 'red';
      });

    var node = svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(graph.nodes)
      .enter()
      .append('g')
      .call(
        d3
          .drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      )
      .on('mouseout.fade', fade(0.6, 1))
      .on('mouseover.fade', fade(0.1, 0.4));

    var circles = node
      .append('circle')
      .attr('r', 10)
      .attr('stroke-width', 2)
      .attr('fill', function(d) {
        return color(d.group);
      });

    node.append('title').text(function(d) {
      return d.id;
    });

    var labels = node
      .append('text')
      .text(function(d) {
        return d.id;
      })
      .attr('x', 30)
      .attr('y', -10)
      .attr('text-anchor', 'middle');

    simulation.nodes(graph.nodes).on('tick', ticked);
    simulation.force('link').links(graph.links);

    function ticked() {
      link
        .attr('x1', function(d) {
          return d.source.x;
        })
        .attr('y1', function(d) {
          return d.source.y;
        })
        .attr('x2', function(d) {
          return d.target.x;
        })
        .attr('y2', function(d) {
          return d.target.y;
        });

      node.attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      });
    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    function fade(linkOpacity, nodeOpacity) {
      return d => {
        node.style('stroke-opacity', function(o) {
          const thisOpacity = isConnected(d, o) ? 1 : nodeOpacity;
          this.setAttribute('fill-opacity', thisOpacity);
          return thisOpacity;
        });

        link.style('stroke-opacity', o =>
          o.source === d || o.target === d ? 0.6 : linkOpacity
        );
      };
    }

    function isConnected(a, b) {
      return (
        linkedById[`${a.id},${b.id}`] ||
        linkedById[`${b.id},${a.id}`] ||
        a.id === b.id
      );
    }

    const linkedById = {};
    graph.links.forEach(d => {
      linkedById[`${d.source.id},${d.target.id}`] = 1;
    });
  });
}
