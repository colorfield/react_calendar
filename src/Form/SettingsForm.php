<?php

namespace Drupal\react_calendar\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Class SettingsForm.
 */
class SettingsForm extends ConfigFormBase {

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
    $calendarViews = ['month', 'week', 'day', 'agenda'];
    $form['default_view'] = [
      '#type' => 'select',
      '#title' => $this->t('Default view'),
      '#description' => $this->t('Calendar view that will be displayed by default.'),
      '#options' => $calendarViews,
      '#default_value' => $config->get('default_view'),
    ];
    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);
    $this->config('react_calendar.settings')
      ->set('default_view', $form_state->getValue('default_view'))
      ->save();
  }

}
