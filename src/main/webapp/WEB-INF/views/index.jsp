<%@ page contentType="text/html;charset=UTF-8" language="java" isELIgnored="false" %>
<%@ taglib prefix="c" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>

<!-- Page body-->
<main class="mdl-layout__content" style="background-color: #f5f5f5" ng-controller="indexCtrl" ng-cloak>
    <div class="page-content">
        <div class="mdl-grid">


            <!-- Content container -->
            <div class="mdl-cell mdl-cell--8-col mdl-cell--8-col-tablet mdl-cell--4-col-phone">
                <ng-include src="'../templates/index/'+tab+'.html'"></ng-include>
            </div>

            <!-- Recommendations -->
            <div class="mdl-cell mdl-cell--2-col mdl-cell--8-col-tablet mdl-cell--4-col-phone">
            </div>
        </div>
    </div>
</main>