<template>
    <header>
        <b-navbar toggleable="md" type="dark" variant="" fixed="top">

            <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

            <b-nav-text class="version">v0.25</b-nav-text>
            <router-link :to="{ name: 'Homepage' }" class="navbar-brand">KNG Configurator<br/></router-link>
            <b-navbar-nav>
                <b-nav-item :to="{ name: 'Import' }" class="hvr-underline-from-center" right>Import</b-nav-item>
            </b-navbar-nav>

            <b-collapse is-nav id="nav_collapse">

                <b-navbar-nav>
                    <b-nav-item :to="{ name: 'ComponentList' }" class="hvr-underline-from-center">Components</b-nav-item>
                    <b-nav-item :to="{ name: 'CompositionList' }" class="hvr-underline-from-center">Compositions</b-nav-item>
                    <b-nav-item :to="{ name: 'OriginList' }" class="hvr-underline-from-center">Origins</b-nav-item>
                </b-navbar-nav>

                <b-navbar-nav class="ml-auto">
                    <b-nav-item-dropdown text="Samples" right>
                        <b-dropdown-item>...</b-dropdown-item>
                    </b-nav-item-dropdown>
                    <b-nav-item-dropdown text="Documentation" right>
                        <b-dropdown-item :to="{ name: 'MainDoc' }">Main doc</b-dropdown-item>
                        <b-dropdown-item :to="{ name: 'DocProcess' }">Processes</b-dropdown-item>
                        <b-dropdown-item :to="{ name: 'Tutorial' }">Tutorial</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>

            </b-collapse>
        </b-navbar>
    </header>
</template>

<script>
export default {
  name: 'Menu'
}
</script>

<style lang="scss">
    @import '../assets/kngconfig.scss';

    .hvr-underline-from-center:before {
        background: $text-light;
        height: 2px;
    }

    .navbar.fixed-top {
        background-color: $bg-dark;
        padding: 0.2rem 1rem;
    }

    .nav-item a {
        border-bottom: 2px solid transparent;
        &.active {
            border-bottom: 2px solid $main-color;
        }
        &.dropdown-item {
            border-bottom: none;
            background-color: transparent;
            color: $text-main;
            outline-color: transparent;
            &:active {
                background-color: transparent;
            }
            &:hover {
                background-color: $bg-main;
            }
            &.active {
                background-color: $main-color-light;
            }
        }
    }

    .navbar-text.version {
        font-size: 0.75rem;
        padding-right: 1rem;
    }

</style>
