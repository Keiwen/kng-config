import Vue from 'vue'
import Router from 'vue-router'
import Homepage from '@/components/Homepage'
import ProcessDoc from '@/components/ProcessDoc'
import ProcessList from '@/components/ProcessList'
import ComponentList from '@/components/ComponentList'
import CompositionList from '@/components/CompositionList'
import OriginList from '@/components/OriginList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Homepage',
      component: Homepage
    },
    {
      path: '/doc-process',
      name: 'DocProcess',
      meta: { docRoute: true },
      component: ProcessDoc
    },
    {
      path: '/processes',
      name: 'ProcessList',
      meta: { buildRoute: true },
      component: ProcessList
    },
    {
      path: '/components',
      name: 'ComponentList',
      meta: { buildRoute: true },
      component: ComponentList
    },
    {
      path: '/compositions',
      name: 'CompositionList',
      meta: { buildRoute: true },
      component: CompositionList
    },
    {
      path: '/origins',
      name: 'OriginList',
      meta: { buildRoute: true },
      component: OriginList
    }
  ]
})
