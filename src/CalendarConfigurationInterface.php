<?php

namespace Drupal\react_calendar;

use Drupal\Core\Entity\ContentEntityInterface;

/**
 * Interface CalendarConfigurationInterface.
 */
interface CalendarConfigurationInterface {

  /**
   * Checks if an entity bundle is enabled.
   *
   * @param \Drupal\Core\Entity\ContentEntityInterface $entity
   *   The entity that is the subject of the template.
   *
   * @return bool
   *   Is the entity type enabled for React Calendar.
   */
  public function isBundleEnabled(ContentEntityInterface $entity);

  /**
   * Returns React Calendar's settings for an entity type bundle.
   *
   * @param string $setting
   *   If 'all' is passed, all available settings are returned.
   * @param string $entity_type_id
   *   The id of the entity type to return settings for.
   * @param string $bundle
   *   The id of the bundle to return settings for.
   *
   * @return string|array
   *   The value of the given setting or an array of all settings.
   */
  public function getEntityBundleSettings($setting, $entity_type_id, $bundle);

  /**
   * Saves React Calendar's settings of an entity type bundle.
   *
   * @param array $settings
   *   The available settings for this bundle.
   * @param string $entity_type_id
   *   The id of the entity type to set the settings for.
   * @param string $bundle
   *   The id of the bundle to set the settings for.
   */
  public function setEntityBundleSettings(array $settings, $entity_type_id, $bundle);

  /**
   * Returns React Calendar's entity type bundle available settings.
   *
   * @return array
   *   List of entity bundle available settings.
   */
  public function availableEntityBundleSettings();

  /**
   * Defines default values for React Calendar settings.
   *
   * @return array
   *   List of entity bundle default settings.
   */
  public function getEntityBundleSettingDefaults();

  /**
   * Returns a list of date related fields (Date or Date Range).
   *
   * @param string $node_type
   *   Node entity type bundle.
   *
   * @return array
   *   List of date fields.
   */
  public function getDateFields($node_type);

}
