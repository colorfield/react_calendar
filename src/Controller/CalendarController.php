<?php

namespace Drupal\react_calendar\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\react_calendar\CalendarConfigurationInterface;

/**
 * Class CalendarController.
 */
class CalendarController extends ControllerBase {

  /**
   * Drupal\Core\Config\ConfigFactoryInterface definition.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $configFactory;
  /**
   * Drupal\react_calendar\CalendarConfigurationInterface definition.
   *
   * @var \Drupal\react_calendar\CalendarConfigurationInterface
   */
  protected $reactCalendarConfig;

  /**
   * Constructs a new CalendarController object.
   */
  public function __construct(ConfigFactoryInterface $config_factory, CalendarConfigurationInterface $react_calendar_config) {
    $this->configFactory = $config_factory;
    $this->reactCalendarConfig = $react_calendar_config;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory'),
      $container->get('react_calendar.config')
    );
  }

  /**
   * Returns a React Calendar.
   *
   * @return array
   *   Return calendar render array.
   */
  public function calendar() {
    $systemWideConfig = $this->configFactory->get('react_calendar.settings');
    // $enabledBundles = $this->reactCalendarConfig->getEnabledBundles();
    //    if (empty($enabledBundles)) {
    //      \Drupal::messenger()->addError($this->t('There must be at least one enabled bundle.'));
    //      return $build;
    //    }.
    // @todo get enabled bundles
    $dataSource = "data': [{'entity_type_id': 'node','bundle_id': 'event','date_field_name': 'field_datetime_range'}]";
    $languagePrefix = $systemWideConfig->get('language_prefix') == '1' ? 'true' : 'false';
    $languageId = $this->languageManager()->getCurrentLanguage()->getId();
    $build = [
      '#theme' => 'react_calendar',
      '#data_source' => $dataSource,
      '#default_view' => $systemWideConfig->get('default_view'),
      '#language_prefix' => $languagePrefix,
      '#language_id' => $languageId,
      '#attached' => [
        'library' => [
          'react_calendar/react_calendar',
        ],
      ],
    ];
    return $build;
  }

}
