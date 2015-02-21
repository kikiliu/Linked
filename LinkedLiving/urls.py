from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.views.generic import TemplateView #mapping template urls
from LinkedLiving.views import GetHealthInfoView


urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'LinkedLiving.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^home$', TemplateView.as_view(template_name="home.html")),
    url(r'^api/get_health_info/$', GetHealthInfoView.as_view(), name='get-health-info-view') 
)
