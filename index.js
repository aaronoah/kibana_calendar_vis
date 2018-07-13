import { resolve } from 'path';

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    publicDir: resolve(__dirname, 'public'),
    uiExports: {
      visTypes: [
        'plugins/kibana_calendar_vis/calendar_type'
      ]
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },
  });
}
