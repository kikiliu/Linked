from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.views.generic import TemplateView #mapping template urls
from LinkedLiving.views import GetHealthInfoView
from LinkedLiving.views import GetTrendView
from LinkedLiving.views import GetDailyView
from LinkedLiving.views import GetActivityView

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'LinkedLiving.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^home$', TemplateView.as_view(template_name="home.html")),

    url(r'^trend$', TemplateView.as_view(template_name="trend.html")),
    url(r'^daily$', TemplateView.as_view(template_name="daily.html")),

    url(r'^trends$', TemplateView.as_view(template_name="trends.html")),

    url(r'^api/get_health_info/$', GetHealthInfoView.as_view(), name='get-health-info-view'), 
    url(r'^api/get_trend/$', GetTrendView.as_view(), name='get-trend-view'),
    url(r'^api/get_daily/$', GetDailyView.as_view(), name='get-daily-view'),
    url(r'^api/get_activity/$', GetActivityView.as_view(), name='get-activity-view')   
)