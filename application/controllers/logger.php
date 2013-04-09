<?php

defined( 'SYSPATH' ) or die( 'No direct access allowed.' );

/**
 * Controller public auth. Pour la gestion d'identification.
 *
 * @package Auth
 * @author Pasquelin Alban
 * @copyright	 (c) 2011
 * @license http://www.openrpg.fr/license.html
 */
class Logger_Controller extends Template_Controller {

		/**
		 * Homepage en cas de non identification.
		 * 
		 * @return  void
		 */
		public function index()
		{
				if( request::is_ajax() )
				{
						$this->auto_render = FALSE;

						$view = new View( 'auth/alert_ajax' );
						$view->render( TRUE );

						return FALSE;
				}

				$this->script = array( 'js/lib/jquery.validate', 'js/class/helvetiker_regular.typeface', 'js/logger' );

				$cache = Cache::instance();

				if( !$this->template->content = $cache->get( 'view_auth' ) )
				{
						$this->template->content = self::auth();
						$cache->set( 'table', $this->template->content, array( 'page' ), 600 );
				}
		}

		/**
		 * Formulaire d'authentification.
		 * 
		 * @return  void
		 */
		public function auth()
		{
				if( Auth::instance()->logged_in() )
						return url::redirect( NULL );

				$view = new View( 'auth/index' );
				$view->msg = $this->input->get( 'msg' );

				if( ($ajax = url::current() == 'logger/auth' ) ? TRUE : FALSE )
						$this->auto_render = FALSE;

				return $view->render( $ajax );
		}

		/**
		 * Formulaire d'inscription.
		 * 
		 * @param bool mode AJAX ou non
		 * @return string form d'inscription
		 */
		public function subscribe( $ajax = TRUE )
		{
				if( $ajax && !request::is_ajax() )
						return FALSE;

				if( $ajax )
						$this->auto_render = FALSE;

				$captcha = new Captcha;

				$view = new View( 'auth/subscribe' );
				$view->captcha = $captcha->render();

				return $view->render( $ajax );
		}

		/**
		 * Formulaire de mot de passe oublié.
		 * 
		 * @param bool mode AJAX ou non
		 * @return string form de mot de passe oublié
		 */
		public function mdp( $ajax = TRUE )
		{
				if( $ajax && !request::is_ajax() )
						return FALSE;

				if( $ajax )
						$this->auto_render = FALSE;

				$captcha = new Captcha;

				$view = new View( 'auth/mdp' );
				$view->captcha = $captcha->render();

				return $view->render( $ajax );
		}

		/**
		 * Logout un utilisateur.
		 * 
		 * @return  void
		 */
		public function logout()
		{
				$this->auto_render = FALSE;

				$authentic = Auth::instance();

				if( $authentic->logged_in() )
						$authentic->logout( TRUE );

				cookie::delete( 'urlAdminUrl' );

				return self::redirection( Kohana::lang( 'logger.disconnect' ) );
		}

		/**
		 * Envoyer mot de passe perdu.
		 * 
		 * @return  void
		 */
		public function send()
		{
				$captcha = new Captcha;

				if( $captcha->invalid_count() > 100 )
						return self::redirection( Kohana::lang( 'logger.error_bot' ) );

				elseif( Auth::instance()->logged_in() )
						return url::redirect( '/' );

				elseif( $_POST )
				{
						if( ($email = $this->input->post( 'emailMDP' )) !== FALSE )
						{
								if( !valid::email( $email ) || !valid::email_domain( $email ) || !valid::email_rfc( $email ) )
										$txt = Kohana::lang( 'logger.error_mail_valid' );

								elseif( !Captcha::valid( $this->input->post( 'captcha_response' ) ) )
										$txt = Kohana::lang( 'logger.error_captcha' );

								elseif( ($mdp = User_Model::modifier_mot_de_passe( $email )) !== FALSE )
								{
										$from = Kohana::config( 'game.name' ).' <'.Kohana::config( 'email.from' ).'>';
										$subject = Kohana::lang( 'logger.title_mail_send_password', Kohana::config( 'game.name' ) );
										$message = Kohana::lang( 'logger.content_mail_send_password', $mdp );

										if( email::send( $email, $from, $subject, $message, TRUE ) )
												$txt = Kohana::lang( 'logger.new_password_send' );
										else
												$txt = Kohana::lang( 'logger.error_password_send' );
								}
								else
										$txt = Kohana::lang( 'logger.error_generate_password' );
						}
						else
								$txt = Kohana::lang( 'logger.error_mail_valid' );
				}
				else
						$txt = Kohana::lang( 'logger.no_acces' );

				return self::redirection( $txt );
		}

		/**
		 * Login un utilisateur après vérification des données POST.
		 * 
		 * @return  void
		 */
		public function login()
		{
				if( $_POST )
				{
						$username = $this->input->post( 'username' );
						$password = $this->input->post( 'password' );

						if( $username && $password )
						{
								$user = ORM::factory( 'user', $username );

								if( $user->loaded )
								{
										if( Auth::instance()->login( $username, $password ) )
												return url::redirect();
										else
												$txt = Kohana::lang( 'logger.error_password' );
								}
								else
										$txt = Kohana::lang( 'logger.no_user' );
						}
						else
								$txt = Kohana::lang( 'logger.no_username_password' );
				}
				else
						$txt = Kohana::lang( 'logger.no_acces' );

				return self::redirection( $txt );
		}

		/**
		 * Enregistrement d'un utilisateur.
		 * 
		 * @return  void
		 */
		public function register()
		{
				$captcha = new Captcha;

				if( $captcha->invalid_count() > 100 )
						return self::redirection( Kohana::lang( 'logger.error_bot' ) );

				elseif( Auth::instance()->logged_in() )
						return url::redirect( cookie::get( 'urlAdminUrl' ).'?msg='.urlencode( Kohana::lang( 'logger.identify' ) ) );

				elseif( $_POST )
				{
						$username = $this->input->post( 'usernameInscript' );
						$password = $this->input->post( 'passwordInscript' );
						$password2 = $this->input->post( 'password2Inscript' );
						$email = $this->input->post( 'emailInscript' );

						$user = ORM::factory( 'user', $username );

						if( !$username || !$password || !$password2 || !$email )
								$txt = Kohana::lang( 'logger.error_all_form' );

						elseif( count( explode( ' ', $username ) ) > 1 )
								$txt = Kohana::lang( 'logger.no_compose_username' );

						elseif( $password != $password2 )
								$txt = Kohana::lang( 'logger.no_good_password' );

						elseif( !valid::email( $email ) || !valid::email_domain( $email ) || !valid::email_rfc( $email ) )
								$txt = Kohana::lang( 'logger.error_mail_valid' );

						elseif( !Captcha::valid( $this->input->post( 'captcha_response' ) ) )
								$txt = Kohana::lang( 'logger.error_captcha' );

						elseif( User_Model::verification_mail( $email ) )
								$txt = Kohana::lang( 'logger.exist_email' );

						elseif( $user->loaded )
								$txt = Kohana::lang( 'logger.exist_username' );

						elseif( $user->insert( array( 'username' => $username,
												'x' => Kohana::config( 'game.initialPosition.x' ),
												'y' => Kohana::config( 'game.initialPosition.y' ),
												'z' => Kohana::config( 'game.initialPosition.z' ),
												'region_id' => Kohana::config( 'game.initialPosition.region' ),
												'speed' => Kohana::config( 'game.initialSpeed' ),
												'gravity' => Kohana::config( 'game.initialGravity' ),
												'password' => Auth::instance()->hash_password( $password ),
												'last_login' => date::Now(),
												'argent' => 0,
												'hp' => Kohana::config( 'game.initialHP' ),
												'hp_max' => Kohana::config( 'game.initialHP' ),
												'email' => $email,
												'ip' => $_SERVER['REMOTE_ADDR'] ) ) )
						{
								Auth::instance()->login( $username, $password );

								$from = Kohana::config( 'game.name' ).' <'.Kohana::config( 'email.from' ).'>';
								$subject = Kohana::lang( 'logger.title_mail_register', Kohana::config( 'game.name' ) );
								$message = Kohana::lang( 'logger.content_mail_register', $username, $email, $password );
								email::send( $email, $from, $subject, $message, TRUE );

								return url::redirect( '?msg='.urlencode( Kohana::lang( 'logger.identify' ) ) );
						}
						else
								$txt = Kohana::lang( 'logger.error_register' );
				}
				else
						$txt = Kohana::lang( 'logger.no_acces' );

				return self::redirection( $txt );
		}

		/**
		 * Redirection avec un message d'alerte.
		 * 
		 * @return  void
		 */
		public function redirection( $msg = FALSE )
		{
				return url::redirect( '?msg='.urlencode( $msg ) );
		}

}

?>