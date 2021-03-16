(function($) {
    // This object holds all i18n messages used in the Scroll WebHelp Theme. See https://github.com/musterknabe/translate.js
    // The first level members correspond to locale keys as used in Java, for example 'en', 'en_US' and so on.
    // The country specific locales override the generic ones, and fallbacks to the generic messages are implemented.
    // Example: If this object contained entries for 'en', 'en_US' and 'de' the following would happen:
    // - 'en_US' documents would use the 'en_US' messages
    // - 'en_GB' documents would use the 'en' messages
    // - documents from all 'de' variations such as 'de_DE' would fall back to 'de' messages
    // - all other documents would use 'en' because that's the global default
    var allI18nMessages = {
        en: {
            searchInputPlaceholder: 'Search for a question, topic, or keyword...',
            searchLabel: '&nbsp;',
            searchResultsTitle: {
                0: 'Search for <em>{query}</em> returned no results',
                1: 'Search results<br /> {query}',
                n: 'Search results<br /> {query}'
            }
        },
        de: {
            searchInputPlaceholder: 'Suche',
            searchLabel: 'Suche nach: {query}',
            searchResultsTitle: {
                0: 'Suche nach <em>{query}</em> ergab keine Treffer.',
                1: 'Suche nach <em>{query}</em> ergab einen Treffer.',
                n: 'Suche nach <em>{query}</em> ergab {n} Treffer.'
            }
        },
        fr: {
            searchInputPlaceholder: 'recherche',
            searchLabel: 'Recherchez: {query}',
            searchResultsTitle: {
                0: 'Recherchez <em>{query}</em> aucun résultat trouvé.',
                1: 'Recherchez <em>{query}</em> un résultat trouvé.',
                n: 'Recherchez <em>{query}</em> {n} résultats trouvés.'
            }
        }
    };

    window.SCROLL_WEBHELP = window.SCROLL_WEBHELP || {};

    window.SCROLL_WEBHELP.escapeHtml = function(text) {
        return $('<div />').text(text).html()
    };

    var viewport = 'desktop';
    //var pageId;

    // firefox detection
    var isFirefox = typeof InstallTrigger !== 'undefined'; // Firefox 1.0+
    var isIE = (navigator.userAgent.indexOf("MSIE") > 0) || (navigator.userAgent.indexOf("Trident") > 0);

    $(document).ready(function() {
        initI18n();

        showLoginMenu();
        showDeveloperMenu();
        showMobileDeveloperMenu();

        /* init Search Functions */
        initSearch();
        initButtons();
        initFooterMenu();

        /* init Keyboard */
        initKeyboard();

        toggleTheme();

        $('.sp-picker').change(function () {
            $(this).closest('form').trigger('submit');
        });

        $('#ht-error-search-button').bind('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            openSearch();
        });
    });

    function initI18n() {
        var currentMessages = allI18nMessages.en;

        var localeSegments = ($('meta[name=scroll-content-language-key]').attr('content') || '').split('_');
        while (localeSegments.length > 0) {
            var locale = localeSegments.join('_');
            if (allI18nMessages[locale]) {
                currentMessages = allI18nMessages[locale];
                break;
            } else {
                localeSegments.pop();
            }
        }

        window.SCROLL_WEBHELP.i18n = libTranslate.getTranslationFunction(currentMessages);
    }

    /*======================================
     =            Toggle Dev Menu         =
     ======================================*/

     function showDeveloperMenu() {
        $('#developerMenu').bind('click', function (e) {
            e.preventDefault();
            setTimeout(toggleDeveloperMenu(), 0.05);
        });
    }

    var isDevMenu = false;

    function toggleDeveloperMenu() {  
        if (isDevMenu) {
            $('.dev-menu').removeClass('show-menu');
            $('.developer-menu-item').removeClass('menu-item-border');
            $('.guide-icon-dev').removeClass('rotate-arrow');
            isDevMenu = false
            $('.dev-menu').unbind('click', toggleDeveloperMenu);
        } else {
            isLoginShowing = true;
            toggleLoginMenu();
            closeSearch()

            $('.dev-menu').addClass('show-menu');
            $('.developer-menu-item').addClass('menu-item-border');
            $('.guide-icon-dev').addClass('rotate-arrow');
            isDevMenu = true;
            $('.dev-menu').bind('click', toggleDeveloperMenu);
        }
    }
      
    $('#developerMenu').click(function(event){
        event.stopPropagation();
    });

    $('.developer-menu-header').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            toggleDeveloperMenu();
            $('.dev-text').focus();
        }
    });

    /*======================================
     =        Toggle Mobile Dev Menu       =
     ======================================*/

     function showMobileDeveloperMenu() {
        $('#developerMenuMobile').bind('click', function (e) {
            e.preventDefault();
            setTimeout(toggleMobileDeveloperMenu(), 0.05);
        });
    }

    var isMobileDevMenuShowing = false;

    function toggleMobileDeveloperMenu() {  
        if (isMobileDevMenuShowing) {
            $('.mobile-dev-dropdown').removeClass('show-mobile-menu');
            $('.mobile-arrow').removeClass('rotate-arrow');
            isMobileDevMenuShowing = false
        } else {
            isDevMenu && toggleDeveloperMenu();
            isLoginShowing && toggleLoginMenu();
            $('.mobile-dev-dropdown').addClass('show-mobile-menu');
            $('.mobile-arrow').addClass('rotate-arrow');
            isMobileDevMenuShowing = true;
        }
    }

    $('html').click(function() {
        isMobileDevMenuShowing && toggleMobileDeveloperMenu();
        isDevMenu && toggleDeveloperMenu();
        isLoginShowing && toggleLoginMenu();
        closeSearch();
    });
      
    $('#developerMenuMobile').click(function(event){
        event.stopPropagation();
        closeSearch();
    });

    $('#logInTab').click(function(event){
        event.stopPropagation();
    });
    
    
    $('#ht-search').click(function(event){
        event.stopPropagation();
    });

    /*======================================
     =           Toggle Login Menu         =
     ======================================*/

    function showLoginMenu() {
        $('#logInTab').bind('click', function (e) {
            e.preventDefault();
            setTimeout(toggleLoginMenu(), 0.05);
        });
    }

    var isLoginShowing = false;

    function toggleLoginMenu() {  
        if (isLoginShowing) {
            $('.login-menu').removeClass('show-menu');
            $('.login-menu-item').removeClass('menu-item-border');
            $('.guide-icon-login').removeClass('rotate-arrow');
            isLoginShowing = false
            $('.login-menu').unbind('click', toggleLoginMenu);
        } else {
            isDevMenu = true;
            toggleDeveloperMenu();
            $('.login-menu').addClass('show-menu');
            $('.login-menu-item').addClass('menu-item-border');
            $('.guide-icon-login').addClass('rotate-arrow');
            isLoginShowing = true;
            $('.login-menu').bind('click', toggleLoginMenu);
        }
    }

    $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height() == $(document).height()) {
            isSidebarExpanded = true;
            toggleSidebar();
        }
     });

     $('.desktop-header-wrapper').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            toggleLoginMenu();
            $('.login-btn').focus();
        }
    });


    /*=========================================
     =               Search                    =
     =========================================*/

    function initSearch() {
        $('.search-input').attr('placeholder', SCROLL_WEBHELP.i18n('searchInputPlaceholder'));

        var debounce = function(func, wait) {
            var timeout;
            var result;
            return function() {
                var args = arguments;
                var context = this;
                var debounced = function() {
                    result = func.apply(context, args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(debounced, wait);
                return result;
            };
        };

        var debouncedSearch = debounce(doSearch, 200);

        var input = $('.search-input');
        input.on('focus', function (e) {
            searchFieldActive = true;

            input.on('blur', function (e) {
                searchFieldActive = false;
            });
        });


        input.on('input', function(e) {
            var str = input.val();
            if (str.length >= 3) {
                debouncedSearch(str);
            }
            if (str.length == 0) {
                $('.ht-search-dropdown').removeClass('open');
            }
        });
    }

    function openSearch() {
        $('body').bind('click', function (e) {
            if (!$(e.target).parents('#ht-search').length && $('#ht-search').hasClass('open')) {
                $('body').unbind('click');
                closeSearch();
            }
        });
        $('#ht-search').addClass('open');
        setTimeout(function () {
            $('.ht-search-clear').addClass('show');
        }, 250);
        searchFieldActive = true;
        $('.search-input')[0].focus();
    }

    function closeSearch() {
        input = $('#ht-search');
        input.find('input').val('');
        input.find('input').blur();
        input.removeClass('open');
        $('.ht-search-clear').removeClass('show');
        input.find('.ht-search-dropdown').removeClass('open');
        $(document).unbind('keydown');
    }


    function navigateToSearchResultsPage(query) {
        if (window.SCROLL_WEBHELP && window.SCROLL_WEBHELP.search) {
            window.SCROLL_WEBHELP.search.navigateToSearchPage(query);
            closeSearch();
        }
    }


    function doSearch(query) {
        var dropdown = $('.ht-search-input .ht-search-dropdown');
        var resultsList = dropdown.find('ul');

        resultsList.empty();

        var handleSearchResults = function(searchResults, query) {
            $(document).unbind('keydown');

            $.each(searchResults, function (index, searchResult) {
                resultsList.append('<li n="' + index + '" class="search-result"><a href="' + searchResult.link + '">' + SCROLL_WEBHELP.escapeHtml(searchResult.title) + '</a><div class="search-result-content"><p class="search-result-desc">' + searchResult.description + '</p></div></li>');
            });
  
            var keybutton = $('<li class="search-key" n="' + searchResults.length + '"><a class="search-key-button" href="#">' + SCROLL_WEBHELP.i18n('searchLabel', {query: '<b>' + SCROLL_WEBHELP.escapeHtml(query) + '</b>'}) + '</a></li>');
            keybutton.bind('click', function(e) {
                navigateToSearchResultsPage($('.search-input').val());
                e.preventDefault();
            });
            resultsList.append(keybutton);

            resultsList.children('li').each(function(_, item) {
                var li = $(item);
                li.bind('mouseover', function () {
                    resultsList.find('li a').removeClass('hover');
                    li.find('a').addClass('hover');
                });
            });

            $(document).bind('keydown', function (e) {
                switch (e.which) {
                    case 13:
                        var selected = $('.ht-search-dropdown a.hover');
                        if (selected.length != 0) {
                            if (selected.is('.search-key-button')) {
                                navigateToSearchResultsPage($('.search-input').val());
                            } else {
                                window.location.href = selected.attr('href');
                            }
                        } else {
                            navigateToSearchResultsPage($('.search-input').val());
                        }
                        break;
                    
                    case 27:
                        if(isLoginShowing) {
                            toggleLoginMenu();
                        }
                        if(isDevMenu) {
                            toggleDeveloperMenu();
                        }
                        break;

                    case 38:
                        dropdownKeydown(-1, dropdown);
                        break;

                    case 40:
                        dropdownKeydown(1, dropdown);
                        break;

                    default:
                        return;
                }

                e.preventDefault();
            });

            dropdown.addClass('open');
        };

        if (window.SCROLL_WEBHELP && window.SCROLL_WEBHELP.search) {
            window.SCROLL_WEBHELP.search.performSearch(query, handleSearchResults);
        }
    }

    function dropdownKeydown(direction, dropdown) {
        var itemcount = dropdown.find('a').length;
        var currentitem = parseInt(dropdown.find('a.hover').parent().attr('n'));
        if (isNaN(currentitem))currentitem = -1;

        var nextitem = currentitem + direction;
        var dropdownHeight = dropdown.height() - 2;

        var itemheight = parseInt(dropdown.find('a.hover').outerHeight());

        if (nextitem < 0 || nextitem >= itemcount)return;

        $.each(dropdown.find('a'), function (index, val) {
            if (index == currentitem)$(this).removeClass('hover');
            if (index == nextitem) {
                $(this).addClass('hover');

                if ((itemheight * (index + 1)) - dropdown.scrollTop() > dropdownHeight) {
                    dropdown.scrollTop((itemheight * (index + 1)) - dropdownHeight);
                } else if ((itemheight * (index + 1)) - dropdown.scrollTop() < itemheight && dropdown.scrollTop() > 0) {
                    dropdown.scrollTop(itemheight * index);
                }
            }
        });
    }


    function initButtons() {
        $('#ht-search-button').bind('click', function (e) {
            e.preventDefault();
            openSearch();
        });

        $('.ht-search-clear').bind('click', function (e) {
            e.preventDefault();
            closeSearch();
        });
    }

    $(document).ready(() => {
        $('#search-input').on('keyup', function () {
            if($('#search-input').val().length >= 3){
                $('#search-results')
                    .load(
                        $('#search').attr('action'), "quicksearch=true&q=" + $("#search-input")
                    .val());
            }
        });
    });
  
    /*================================
     =            Dropdown            =
     ================================*/

    function setDropdown(select) {
        var container = select.parent();
        var svg = '<svg width="10px" height="10px" viewBox="0 0 10 10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g class="ht-select-button-icon"><path d="M2,3 L8,3 L5,7 L2,3 Z"></path></g></svg>';
        var toggle = $('<a class="ht-select-button"><span>' + createOptionText(select.find('option:selected')) + '</span>' + svg + '</a>');
        container.append(toggle);

        var label = container.parent().find('label').remove();
        toggle.prepend(label);

        var dropdown = $('<div class="ht-dropdown ht-dropdown-select"><ul></ul></div>');
        container.append(dropdown);

        var allAccessible = allEntriesAccessible(select);
        $.each(select.find('option'), function (index, val) {
            var item = $('<li n="' + index + '"><a data-scroll-integration-name="' + select.attr('name') + '" data-scroll-integration-title="' + $(this).text() + '" data-scroll-integration-value="' + $(this).attr('value') + '">' + createOptionText($(this), !allAccessible) + '</a></li>');
            dropdown.find('ul').append(item);
        });

        select.on('change', function () {
            var val = select.val();
            toggle.find('span').text(select.find('option:selected').text());
        });

        toggle.bind('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (viewport == 'mobile' && !(isFirefox || isIE)) {
                openSelect(select);
                return false;
            }


            if ($(this).hasClass('active')) {
                toogleDropdown(container, false);
                $(this).removeClass('active');
            } else {
                $.each($('.' + container.attr('class')), function (index, val) {
                    if ($(this).find('.ht-select-button').hasClass('active')) {
                        toogleDropdown($(this), false);
                    }
                });

                toogleDropdown(container, true);
                $(this).addClass('active');
            }

            return false;
        });
    }

    /** Check if all of the entries in the given select are runtime accessible (currently only relevant for versions). */
    function allEntriesAccessible(select) {
        var allAccessible = true;
        if (select.attr('name') === 'scroll-versions:version-name') {
            $.each(select.find('option'), function () {
                allAccessible &= ($(this).attr('data-version-accessible') === 'true');
            });
        }
        return allAccessible;
    }

    /** Create the text for the drop-down entries (version entries may contain some extra info other than the property name). */
    function createOptionText(option, showVersionAccessibility) {
        var optionText = option.text();
        if (showVersionAccessibility) {
            var versionAccessible = option.attr('data-version-accessible');
            if (versionAccessible) {
                optionText += ' <span style="float: right; margin-left: 0.8em; color: #dddddd;';
                if (versionAccessible === 'true') {
                    optionText += 'visibility: hidden;';
                }
                optionText += '" class="k15t-icon-viewport"></span>';
            }
        }
        return optionText;
    }

    function toogleDropdown(container, open) {
        if (open) {
            $('body').bind('click', function (e) {
                e.preventDefault();
                if ($(e.target).is(container.find('*')))return;
                toogleDropdown(container, !open);
            });

        } else {
            $('body').unbind('click');
        }

        var toggle = container.find('.ht-select-button');
        var dropdown = container.find('.ht-dropdown');

        if (open) {
            toggle.addClass('active');
            dropdown.addClass('open');

            $.each(dropdown.find('li'), function (index, val) {
                $(this).bind('mouseover', function () {
                    dropdown.find('li a').removeClass('hover');
                    $(this).find('a').addClass('hover');
                });

                $(this).find('a').bind('click', function (e) {
                    e.preventDefault();

                    var name = $(e.target).closest('a').attr('data-scroll-integration-name');
                    var value = $(e.target).closest('a').attr('data-scroll-integration-value');
                    var title = $(e.target).closest('a').attr('data-scroll-integration-title');

                    toggle.find('span').text(title);

                    var target = window.location.pathname + '?' + name + '=' + value;

                    var context = toggle.closest('form').find('input[name=context]').val();
                    if (context) {
                        target += '&context=' + context;
                    }

                    window.location.href = target;
                });
            });
        } else {
            toggle.removeClass('active');
            dropdown.removeClass('open');
        }
    }


    /*=====================================
     =             Keyboard              =
     =====================================*/
    var searchFieldActive;
    var lastKey;
    var activeElement;

    function initKeyboard() {
        searchFieldActive = false;

        $('body').bind('keyup', function (e) {
            activeElement = document.activeElement;

            if ((searchFieldActive && e.which != 27)
                || (activeElement && (activeElement.type === 'text' || activeElement.type === 'textarea'))) {
                return;
            }

            switch (e.which) {
                case 219: // [
                    if (viewport !== 'desktop') {
                        toggleSidebar();
                    }
                    break;

                case 191: // /
                    if (!sidebarExpanded) {
                        openSearch();
                    }
                    break;

                case 71: // g
                    if (lastKey == 71) {
                        if (!sidebarExpanded) {
                            openSearch();
                        }
                    }
                    break;

                case 27: // esc
                    closeSearch();
                    break;
            }

            lastKey = e.which;
        });
    }
  
    /*=====================================
     =              Theme               =
     =====================================*/

     function toggleTheme() {
        var toggle = $('.toggle-track');
        var theme = localStorage.getItem("theme");
        if (theme) {
            $("body").addClass(theme);
            if (theme == "dark") {
                toggle.addClass("toggled");
            }
        } else {
            localStorage.setItem("theme", "light");
            $("body").addClass("light");
        }

        toggle.on('click', function () {
            if (toggle.hasClass("toggled")) {
                toggle.removeClass("toggled");
                localStorage.setItem("theme", "light");
                $('body').removeClass("dark");
                $('body').addClass("light");

            } else {
                toggle.addClass("toggled");
                localStorage.setItem("theme", "dark");
                $('body').removeClass("light");
                $('body').addClass("dark");
            }
        });
    }

     /*===================================
     =            Init Footer            =
     ===================================*/

    function initFooterMenu() {
        $('#solution').bind('click', function (e) {
            e.preventDefault();
            setTimeout(toggleFooterMenu('solution'), 0.05);
        });
        $('#company').bind('click', function (e) {
            e.preventDefault();
            setTimeout(toggleFooterMenu('company'), 0.05);
        });
        $('#integration').bind('click', function (e) {
            e.preventDefault();
            setTimeout(toggleFooterMenu('integration'), 0.05);
        });
        $('#insights').bind('click', function (e) {
            e.preventDefault();
            setTimeout(toggleFooterMenu('insight'), 0.05);
        });
    }

    function toggleFooterMenu(item) {
        if(item == 'solution') {
            if($('.sol').hasClass('solution-container')) {
                $('.sol').removeClass('solution-container');
            } else {
                $('.sol').addClass('solution-container');
            }
        } else if(item == 'integration'){
            if($('.integration').hasClass('integration-container')) {
                $('.integration').removeClass('integration-container');
            } else {
                $('.integration').addClass('integration-container');
            }
          
        } else if(item == 'insight'){
            if($('.insight').hasClass('insight-container')) {
                $('.insight').removeClass('insight-container');
            } else {
                $('.insight').addClass('insight-container');
            }
        } else {
            if($('.comp').hasClass('company-container')) {
                $('.comp').removeClass('company-container');
            } else {
                $('.comp').addClass('company-container');
            }
        }
    } 
})($);
