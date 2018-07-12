<?php

namespace Drupal\react_calendar;

use Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException;
use Drupal\Component\Plugin\Exception\PluginNotFoundException;
use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityManager;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Config\ConfigFactoryInterface;

/**
 * Class Calendart.
 */
class CalendarConfiguration implements CalendarConfigurationInterface {

  /**
   * Drupal\Core\Entity\EntityTypeManagerInterface definition.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * Drupal\Core\Entity\EntityManager definition.
   *
   * @var \Drupal\Core\Entity\EntityManager
   */
  protected $entityManager;

  /**
   * Drupal\Core\Config\ConfigFactoryInterface definition.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $configFactory;

  /**
   * Constructs a new Repec object.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager, EntityManager $entity_manager, ConfigFactoryInterface $config_factory) {
    $this->entityTypeManager = $entity_type_manager;
    $this->entityManager = $entity_manager;
    $this->configFactory = $config_factory;
  }

  /**
   * {@inheritdoc}
   */
  public function isBundleEnabled(ContentEntityInterface $entity) {
    return $this->getEntityBundleSettings('enabled', $entity->getEntityTypeId(), $entity->bundle());
  }

  /**
   * {@inheritdoc}
   */
  public function getEnabledEntityTypeBundles($entity_type_id) {
    $result = [];
    try {
      $entityTypes = $this->entityTypeManager->getStorage($entity_type_id)->loadMultiple();
      foreach ($entityTypes as $entityType) {
        // @todo check enabled
        $result[] = $entityType->id();
      }
    }
    catch (PluginNotFoundException $exception) {
      \Drupal::messenger()->addError($exception->getMessage());
    }
    catch (InvalidPluginDefinitionException $exception) {
      \Drupal::messenger()->addError($exception->getMessage());
    }
    return $result;
  }

  /**
   * {@inheritdoc}
   */
  public function getEnabledBundles() {
    // TODO: Implement getEnabledBundles() method.
    $result = [];
    return $result;
  }

  /**
   * {@inheritdoc}
   */
  public function getEntityBundleSettings($setting, $entity_type_id, $bundle) {
    $config = $this->configFactory->get('react_calendar.entity_type.settings');
    $settings = unserialize($config->get('react_calendar_bundle.' . $entity_type_id . '.' . $bundle));
    if (empty($settings)) {
      $settings = [];
    }
    $settings += $this->getEntityBundleSettingDefaults();

    if ($setting == 'all') {
      return $settings;
    }
    return isset($settings[$setting]) ? $settings[$setting] : NULL;
  }

  /**
   * {@inheritdoc}
   */
  public function setEntityBundleSettings(array $settings, $entity_type_id, $bundle) {
    $config = \Drupal::configFactory()->getEditable('react_calendar.entity_type.settings');
    // Do not store default values.
    foreach ($this->getEntityBundleSettingDefaults() as $setting => $default_value) {
      if (isset($settings[$setting]) && $settings[$setting] == $default_value) {
        unset($settings[$setting]);
      }
    }
    $config->set('react_calendar_bundle.' . $entity_type_id . '.' . $bundle, serialize($settings));
    $config->save();
  }

  /**
   * {@inheritdoc}
   */
  public function availableEntityBundleSettings() {
    return [
      'enabled',
      'date_field',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getEntityBundleSettingDefaults() {
    return [
      'enabled' => FALSE,
      'date_field' => NULL,
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getDateFields($node_type) {
    $result = [];
    $dateTypes = ['datetime', 'daterange'];
    $bundleFields = $this->entityManager->getFieldDefinitions('node', $node_type);
    /** @var \Drupal\Core\Field\FieldDefinitionInterface $fieldDefinition */
    foreach ($bundleFields as $fieldName => $fieldDefinition) {
      if (!empty($fieldDefinition->getTargetBundle()) && in_array($fieldDefinition->getType(), $dateTypes)) {
        $result[$fieldName] = $fieldDefinition->getLabel();
      }
    }
    return $result;
  }

}
