<?php

namespace Drupal\react_calendar\Form;

use Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException;
use Drupal\Component\Plugin\Exception\PluginNotFoundException;
use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Config\ConfigFactoryInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;

/**
 * Class SettingsForm.
 */
class SettingsForm extends ConfigFormBase {

  /**
   * Drupal\Core\Entity\EntityTypeManagerInterface definition.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * Constructs a new SettingsForm object.
   */
  public function __construct(
    ConfigFactoryInterface $config_factory,
      EntityTypeManagerInterface $entity_type_manager
    ) {
    parent::__construct($config_factory);
    $this->entityTypeManager = $entity_type_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory'),
      $container->get('entity_type.manager')
    );
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'react_calendar.settings',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'react_calendar_settings';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('react_calendar.settings');
    $nodeTypes = [];
    try {
      $nodeTypesData = $this->entityTypeManager->getStorage('node_type')->loadMultiple();
      foreach ($nodeTypesData as $key => $nodeType) {
        $nodeTypes[$key] = $nodeType->label();
      }
    }
    catch (PluginNotFoundException $exception) {
      \Drupal::messenger()->addError($exception->getMessage());
    }
    catch (InvalidPluginDefinitionException $exception) {
      \Drupal::messenger()->addError($exception->getMessage());
    }

    $form['node_type'] = [
      '#type' => 'select',
      '#title' => $this->t('Content types'),
      '#description' => $this->t('Content types to be included on the calendar display.'),
      '#options' => $nodeTypes,
      '#multiple' => TRUE,
      '#size' => 5,
      '#default_value' => $config->get('node_type'),
    ];
    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);

    $this->config('react_calendar.settings')
      ->set('node_type', $form_state->getValue('node_type'))
      ->save();
  }

}
