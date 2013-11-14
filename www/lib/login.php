<?php

/*
 * Returns whether the user is currently logged in or not.
 */
function pip_is_logged_in() {
	return '' !== pip_get_session_var( 'user' );
}

/*
 * If logged in, return the session array. Otherwise, return null.
 */
function pip_get_session() {

	if ( pip_is_logged_in() )
		return array(
			'user' => pip_get_session_var( SessionVariables::Username ),
			'pass' => pip_get_session_var( SessionVariables::Password )
			);
	else
		return null;
}

/*
 * Returns the session (if found) to the given array.
 */
function pip_append_session_to_array( $array ) {
	$session = pip_get_session();

	if ( null !== $session )
		$array['session'] = $session;

	return $array;
}

/*
 * Validates whether a set of user credentials are valid.
 */
function pip_credentials_are_valid( $username, $password ) {
	/*
	 * TODO: Actually implement a proper user backend. For now, we just
	 * assume that whatever details were provided were successful.
	 */
	return true;
}

/*
 * Sets the current session.
 */
function pip_login( $username, $password ) {
	pip_set_session_var( SessionVariables::Username, $username );
	pip_set_session_var( SessionVariables::Password, $password );
}

/*
 * Returns whether we're currently attempting a page login.
 */
function pip_attempting_login() {
	return pip_post_var_isset( PostVariables::Username );
}

/*
 * Called when a login attempt is unsuccessful.
 */
function pip_failed_login() {
	/*
	 * TODO: Provide visual feedback to the user that the attempt was
	 * unsuccessful.
	 */
}

/*
 * Perform a login attempt.
 */
function pip_do_login_attempt() {
	$username = pip_get_post_var( PostVariables::Username );
	$password = pip_get_post_var( PostVariables::Password );

	if ( pip_credentials_are_valid( $username, $password ) )
		pip_login( $username, $password );
	else
		pip_failed_login();
}

/* Handle login attempt */
if ( pip_attempting_login() )
	pip_do_login_attempt();