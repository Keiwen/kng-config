import Vue from 'vue'
import Router from 'vue-router'
import Homepage from '@/components/Homepage'
import Import from '@/components/Import'
import ProcessDoc from '@/components/ProcessDoc'
import MainDoc from '@/components/MainDoc'
import Tutorial from '@/components/Tutorial'
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
      path: '/import',
      name: 'Import',
      component: Import
    },
    {
      path: '/doc/process',
      name: 'DocProcess',
      meta: { docRoute: true },
      component: ProcessDoc
    },
    {
      path: '/doc/main',
      name: 'MainDoc',
      meta: { docRoute: true },
      component: MainDoc
    },
    {
      path: '/doc/tuto',
      name: 'Tutorial',
      meta: { docRoute: true },
      component: Tutorial
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
