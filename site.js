---
---
;{% include js/jquery-1.6.4.min.js %}
;{% include js/underscore.js %}
;

(function(context) {

var longneck = {};

longneck.githubWatcherProject = function(resp) {
    var watcherProject = $('.follower-project');
    var i = 0;
    var max = 4; // Make a maximum of five requests before giving up.
    var shuffled = _(resp.data).shuffle();

    var getProjects = function(u) {
        $.ajax({
            url: 'https://api.github.com/users/' + u.login + '/repos',
            dataType: 'jsonp',
            success: function(resp) {
                if (!resp.data.length) return;
                var repo = _(resp.data)
                    .chain()
                    .shuffle()
                    .detect(function(r) { return r.language === '{{site.github_lanaguage}}' })
                    .value();

                if (!repo) {
                    getProjects(shuffled[i++]);
                } else {
                    var template =
                        ""
                        + "<a target='_blank' href='http://github.com/<%=owner.login%>'><%=owner.login%></a>"
                        + " / "
                        + "<a target='_blank' href='<%=html_url%>'>"
                        + "<span class='title'><strong><%=name%></strong></span>"
                        + "</a>"
                        + "<span class='title'> <%=description%></span>"
                        + "";
                    var t = _(template).template(repo);
                    watcherProject.append(t).addClass('loaded');
                }

            }
        });
    };
    getProjects(shuffled[i]);
};

longneck.githubWatchers = function() {
    var watchers = $('.followers');
    $.ajax({
        // TODO: this endpoint only returns maximum 30 users. Implement random
        // pagination so we see different groups of people.
        url: 'https://api.github.com/repos/{{site.github_login}}/{{site.github_repo}}/subscribers',
        dataType: 'jsonp',
        success: function(resp) {
            if (!resp.data.length) return;
            longneck.githubWatcherProject(resp);
            var template =
                "<a class='github-user' target='_blank' href='http://github.com/<%=login%>'>"
                + "<span style='background-image:url(<%=avatar_url%>)' class='thumb' /></span>"
                + "</a>";
            var t = _(resp.data)
                .map(function(i) { return _(template).template(i); })
                .join('');
            watchers.append(t);
        }
    });
};
$(longneck.githubWatchers);


longneck.setup = function() {
    $('.watch').hover(
        function() { $('.watch-docs').addClass('active') },
        function() { $('.watch-docs').removeClass('active') }
    )
}
$(longneck.setup);

context.longneck = longneck;
})(window);
