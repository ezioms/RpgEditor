<?php

defined( 'SYSPATH' ) OR die( 'No direct access allowed.' );

class Install_Controller extends Template_Controller {

		/**
		 * Méthode : dashboard des modules/plugins (installer/supprimer)
		 */
		public function index()
		{
				$list_config = file::listing_dir( DOCROOT.'../modules/plugins/views' );

				$this->template->titre = Kohana::lang( 'install.title' );

				$this->template->contenu = new View( 'install/index' );

				$this->template->contenu->modules = $list_config;

				$this->template->contenu->chmod = self::chmod();
		}

		/**
		 * Méthode : installation du module
		 */
		public function zip()
		{
				$this->auto_render = FALSE;

				if( !isset( $_FILES['zip'] ) || !$_FILES['zip'] )
						return url::redirect( 'install?msg='.urlencode( Kohana::lang( 'install.no_file_zip' ) ) );
				elseif( ( $result = self::chmod() ) !== FALSE )
						return url::redirect( 'install?msg='.urlencode( $result ) );

				$fichier = basename( $_FILES['zip']['name'] );
				$extensions = array( '.zip' );
				$extension = strrchr( $_FILES['zip']['name'], '.' );

				if( !in_array( $extension, $extensions ) )
						return url::redirect( 'install?msg='.urlencode( Kohana::lang( 'install.update_file_zip' ) ) );

				$fichier = strtr( $fichier, 'ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿ', 'AAAAAACEEEEIIIIOOOOOUUUUYaaaaaaceeeeiiiioooooouuuuyy' );
				$fichier = preg_replace( '/([^.a-z0-9]+)/i', '-', $fichier );

				if( !@move_uploaded_file( $_FILES['zip']['tmp_name'], MODPATH.'../tmp/'.$fichier ) )
						return url::redirect( 'install?msg='.urlencode( Kohana::lang( 'install.no_save_zip' ) ) );

				require_once MODPATH.'global/libraries/Pclzip.php';
				$archive = new PclZip( MODPATH.'../tmp/'.$fichier );

				if( ($list = $archive->extract( PCLZIP_OPT_PATH, MODPATH.'../tmp/' ) ) === FALSE )
						return url::redirect( 'install?msg='.urlencode( Kohana::lang( 'install.error_compress' ) ) );

				unlink( MODPATH.'../tmp/'.$fichier );

				$dir = $list[0]['filename'];
				$name_module = str_replace( '/', '', $list[0]['stored_filename'] );
				foreach( $list as $row )
						$elements[$row['stored_filename']] = $row;

				$locale = Kohana::config( 'locale.language' );

				if( file_exists( MODPATH.'plugins/views/'.$name_module ) )
				{
						file::rm_all_dir( $dir );
						return url::redirect( 'install?msg='.urlencode( Kohana::lang( 'install.existe_mod' ) ) );
				}

				if( !self::copy_file( $name_module.'/views/'.$name_module, 'views/'.$name_module ) )
				{
						file::rm_all_dir( $dir );
						return url::redirect( 'install?msg='.urlencode( Kohana::lang( 'install.no_view' ) ) );
				}

				self::copy_file( $name_module.'/css/'.$name_module, 'css/'.$name_module );

				self::copy_file( $name_module.'/js/'.$name_module, 'js/'.$name_module );

				self::copy_file( $name_module.'/images/'.$name_module, 'images/'.$name_module );

				self::copy_file( $name_module.'/controllers', 'controllers', 'admin_'.$name_module.EXT );

				self::copy_file( $name_module.'/controllers', 'controllers', 'plugin_'.$name_module.EXT );

				self::copy_file( $name_module.'/i18n/'.$locale[0], 'i18n/'.$locale[0], 'plg_'.$name_module.EXT );

				self::copy_file( $name_module.'/models', 'models', $name_module.EXT );

				file::rm_all_dir( $dir );

				url::redirect( 'install?msg='.urlencode( 'Plugin '.$name_module.' installé' ) );
		}

		/**
		 * Méthode : Supprimer un module
		 */
		public function delete( $module )
		{
				if( in_array( $module, Kohana::config( 'modules.system' ) ) )
						url::redirect( 'install?msg='.urlencode( 'Impossible : module système' ) );

				$locale = Kohana::config( 'locale.language' );

				if( file_exists( MODPATH.'plugins/views/'.$module ) )
						file::rm_all_dir( MODPATH.'plugins/views/'.$module );

				if( file_exists( MODPATH.'../css/'.$module ) )
						file::rm_all_dir( MODPATH.'../css/'.$module );

				if( file_exists( MODPATH.'../js/'.$module ) )
						file::rm_all_dir( MODPATH.'../js/'.$module );

				if( file_exists( MODPATH.'../images/'.$module ) )
						file::rm_all_dir( MODPATH.'../images/'.$module );

				if( file_exists( MODPATH.'plugins/controllers/admin_'.$module.EXT ) )
						unlink( MODPATH.'plugins/controllers/admin_'.$module.EXT );

				if( file_exists( MODPATH.'plugins/controllers/plugin_'.$module.EXT ) )
						unlink( MODPATH.'plugins/controllers/plugin_'.$module.EXT );

				if( file_exists( MODPATH.'plugins/i18n/'.$locale[0].'/plg_'.$module.EXT ) )
						unlink( MODPATH.'plugins/i18n/'.$locale[0].'/plg_'.$module.EXT );

				if( file_exists( MODPATH.'plugins/models/'.$module.EXT ) )
						unlink( MODPATH.'plugins/models/'.$module.EXT );

				Map_Model::instance()->delete_detail( array( 'module_map' => $module ) );

				url::redirect( 'install?msg='.urlencode( 'Plugin '.$module.' supprimé' ) );
		}

		/**
		 * Méthode : Verifie la valeur des dossiers par défaut
		 */
		private static function chmod()
		{
				$error = FALSE;

				if( !is_writable( MODPATH.'../css/' ) )
						$error .= '<h4 class="alert_error">chmod 777 '.MODPATH.'../css/'.'</h4>';

				if( !is_writable( MODPATH.'../js/' ) )
						$error .= '<h4 class="alert_error">chmod 777 '.MODPATH.'../js/'.'</h4>';

				if( !is_writable( MODPATH.'../images/' ) )
						$error .= '<h4 class="alert_error">chmod 777 '.MODPATH.'../images/'.'</h4>';

				if( !is_writable( MODPATH.'plugins/controllers/' ) )
						$error.= '<h4 class="alert_error">chmod 777 '.MODPATH.'plugins/controllers/'.'</h4>';

				if( !is_writable( MODPATH.'plugins/models/' ) )
						$error .= '<h4 class="alert_error">chmod 777 '.MODPATH.'plugins/models/'.'</h4>';

				if( !is_writable( MODPATH.'plugins/views/' ) )
						$error .= '<h4 class="alert_error">chmod 777 '.MODPATH.'plugins/views/'.'</h4>';

				$locale = Kohana::config( 'locale.language' );

				if( !is_writable( MODPATH.'plugins/i18n/'.$locale[0] ) )
						$error .= '<h4 class="alert_error">chmod 777 '.MODPATH.'plugins/i18n/'.$locale[0].'</h4>';

				if( $error )
						$error = str_replace( 'modules/../', '', $error );

				return $error;
		}

		/**
		 * Méthode : copie les fichier dezzipé dans les emplacement souhaités
		 */
		private static function copy_file( $src, $dest, $file = FALSE )
		{
				$src = MODPATH.'../tmp/'.$src;
				$dest = MODPATH.'plugins/'.$dest;

				if( !$file && !is_dir( $src ) )
						return FALSE;

				elseif( $file && !file_exists( $src.'/'.$file ) )
						return FALSE;

				if( $file )
						return rename( $src.'/'.$file, $dest.'/'.$file );
				else
						return rename( $src.'/', $dest.'/' );
		}

}

?>
