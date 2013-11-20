<?php

/*
 * The names of valid GET variables. All accessing of GET variables should be
 * done indirectly using the pip_{get,set}_get_var() API and using the values
 * found in this class.
 */
abstract class GetVariables {
	const Query = "q";
	const Record = "id";

	static function val() {
		return array(
			self::Query,
			self::Record
			);
	}
}

/*
 * Returns whether a given GET variable is valid, i.e. whether it has been
 * defined in the GetVariables class. If the variable name is found, return
 * true, else false.
 */
function pip_get_is_valid( $var ) {
	foreach ( GetVariables::val() as $val ) {
		if ( $val == $var )
			return true;
	}

	return false;
}

/*
 * Ensure that the given variable has an entry in the GetVariables class.
 */
function pip_get_fail_if_not_valid( $var ) {
	if ( !pip_get_is_valid( $var ) ) {
		throw new IllegalSuperglobalException( $var, '_GET',
						       GetVariables::val() );
	}
}

/*
 * Returns wheteher a particular GET variable is set or not.
 */
function pip_get_isset( $var ) {
	pip_get_fail_if_not_valid( $var );

	return isset( $_GET[$var] );
}

/*
 * Return a particular GET variable if defined, else an empty string.
 */
function pip_get( $var ) {
	pip_get_fail_if_not_valid( $var );

	if ( pip_get_isset( $var ) )
		return $_GET[$var];
	else
		return "";
}
