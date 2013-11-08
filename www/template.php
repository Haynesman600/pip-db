<?php

require_once( './lib/Twig/Autoloader.php' );

Twig_Autoloader::register();

$twig_loader = new Twig_Loader_Filesystem( './html' );
$twig_args = array();

$twig = new Twig_Environment( $twig_loader, $twig_args );

function render_template( $template_name, $template_args ) {
	global $twig;

	$template_extension = '.html';
	$template_file = $template_name . $template_extension;

	$template = $twig->loadTemplate( $template_file );

	$template->display( $template_args );
}
