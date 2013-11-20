<?php

/*
 * Returns the URL of the referring page. If there is none, then default to the
 * homepage.
 */
function pip_history_get_referer() {
	if ( isset( $_SERVER['HTTP_REFERER'] ) )
		return $_SERVER['HTTP_REFERER'];
	else
		return '/home';
}
