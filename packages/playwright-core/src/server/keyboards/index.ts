
/**
 * Copyright 2017 Google Inc. All rights reserved.
 * Modifications copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This file is generated by generate_keyboard_layouts.js, do not edit manually.

import defaultKeyboardLayoutJson from './layouts/00000409.json';

export type KeyDefinition = {
  key: string;
  keyCode: number;
  keyCodeWithoutLocation?: number;
  shiftKey?: string;
  shiftKeyCode?: number;
  text?: string;
  location?: number;
};

export type KeyboardLayout = { [s: string]: KeyDefinition; };

export type KeyboardLayoutMap = Record<string, KeyboardLayout>;

export const defaultKlid = '00000409';
export const defaultKeyboardLayout = defaultKeyboardLayoutJson;

export const localeMapping = new Map<string, string>([
  ['af_za', '00000409'], // US keyboard
  ['en_us', '00000409'], // US keyboard
  ['en_au', '00000409'], // US keyboard
  ['en_bz', '00000409'], // US keyboard
  ['en_ca', '00000409'], // US keyboard
  ['en_029', '00000409'], // US keyboard
  ['en_hk', '00000409'], // US keyboard
  ['en_jm', '00000409'], // US keyboard
  ['en_my', '00000409'], // US keyboard
  ['en_ph', '00000409'], // US keyboard
  ['en_sg', '00000409'], // US keyboard
  ['en_za', '00000409'], // US keyboard
  ['en_tt', '00000409'], // US keyboard
  ['en_zw', '00000409'], // US keyboard
  ['fil_ph', '00000409'], // US keyboard
  ['id_id', '00000409'], // US keyboard
  ['jv', '00000409'], // US keyboard
  ['rw_rw', '00000409'], // US keyboard
  ['sw_ke', '00000409'], // US keyboard
  ['ms_my', '00000409'], // US keyboard
  ['ms_bn', '00000409'], // US keyboard
  ['moh_ca', '00000409'], // US keyboard
  ['om_et', '00000409'], // US keyboard
  ['pap_029', '00000409'], // US keyboard
  ['st_za', '00000409'], // US keyboard
  ['so_so', '00000409'], // US keyboard
  ['uz_latn_uz', '00000409'], // US keyboard
  ['ts_za', '00000409'], // US keyboard
  ['xh_za', '00000409'], // US keyboard
  ['zu_za', '00000409'], // US keyboard
  ['sq_al', '0000041C'], // Albanian keyboard
  ['gsw_fr', '0000040C'], // French keyboard
  ['br_fr', '0000040C'], // French keyboard
  ['fr_fr', '0000040C'], // French keyboard
  ['co_fr', '0000040C'], // French keyboard
  ['fr_cm', '0000040C'], // French keyboard
  ['fr_ci', '0000040C'], // French keyboard
  ['fr_ht', '0000040C'], // French keyboard
  ['fr_ml', '0000040C'], // French keyboard
  ['fr_mc', '0000040C'], // French keyboard
  ['fr_ma', '0000040C'], // French keyboard
  ['fr_re', '0000040C'], // French keyboard
  ['fr_sn', '0000040C'], // French keyboard
  ['fr_cd', '0000040C'], // French keyboard
  ['mg', '0000040C'], // French keyboard
  ['oc_fr', '0000040C'], // French keyboard
  ['ar_sa', '00000401'], // Arabic (101) keyboard
  ['ar_bh', '00000401'], // Arabic (101) keyboard
  ['ar_eg', '00000401'], // Arabic (101) keyboard
  ['ar_iq', '00000401'], // Arabic (101) keyboard
  ['ar_jo', '00000401'], // Arabic (101) keyboard
  ['ar_kw', '00000401'], // Arabic (101) keyboard
  ['ar_lb', '00000401'], // Arabic (101) keyboard
  ['ar_ly', '00000401'], // Arabic (101) keyboard
  ['ar_om', '00000401'], // Arabic (101) keyboard
  ['ar_qa', '00000401'], // Arabic (101) keyboard
  ['ar_sy', '00000401'], // Arabic (101) keyboard
  ['ar_ae', '00000401'], // Arabic (101) keyboard
  ['ar_ye', '00000401'], // Arabic (101) keyboard
  ['ar_dz', '00020401'], // Arabic (102) AZERTY keyboard
  ['ar_ma', '00020401'], // Arabic (102) AZERTY keyboard
  ['ar_tn', '00020401'], // Arabic (102) AZERTY keyboard
  ['hy_am', '0002042B'], // Armenian Phonetic keyboard
  ['as_in', '0000044D'], // Assamese - INSCRIPT keyboard
  ['es_es_tradnl', '0000040A'], // Spanish keyboard
  ['eu_es', '0000040A'], // Spanish keyboard
  ['ca_es', '0000040A'], // Spanish keyboard
  ['gl_es', '0000040A'], // Spanish keyboard
  ['es_es', '0000040A'], // Spanish keyboard
  ['ca_es_valencia', '0000040A'], // Spanish keyboard
  ['az_latn_az', '0000042C'], // Azerbaijani Latin keyboard
  ['az_cyrl_az', '0000082C'], // Azerbaijani Cyrillic keyboard
  ['bn_bd', '00000445'], // Bangla keyboard
  ['ba_ru', '0000046D'], // Bashkir keyboard
  ['be_by', '00000423'], // Belarusian keyboard
  ['bn_in', '00020445'], // Bangla - INSCRIPT keyboard
  ['kok_in', '00000439'], // Devanagari - INSCRIPT keyboard
  ['sa_in', '00000439'], // Devanagari - INSCRIPT keyboard
  ['bs_latn_ba', '0000041A'], // Standard keyboard
  ['hr_hr', '0000041A'], // Standard keyboard
  ['hr_ba', '0000041A'], // Standard keyboard
  ['bs_cyrl_ba', '0000201A'], // Bosnian (Cyrillic) keyboard
  ['bg_bg', '00030402'], // Bulgarian keyboard
  ['my_mm', '00130C00'], // Myanmar (Visual order) keyboard
  ['it_it', '00000410'], // Italian keyboard
  ['tzm_latn_dz', '0000085F'], // Central Atlas Tamazight keyboard
  ['tzm_tfng_ma', '0000105F'], // Tifinagh (Basic) keyboard
  ['zgh', '0000105F'], // Tifinagh (Basic) keyboard
  ['ku_arab_iq', '00000492'], // Central Kurdish keyboard
  ['ru_ru', '00000419'], // Russian keyboard
  ['chr_cher_us', '0000045C'], // Cherokee Nation keyboard
  ['de_de', '00000407'], // German keyboard
  ['de_at', '00000407'], // German keyboard
  ['de_lu', '00000407'], // German keyboard
  ['en_gb', '00000809'], // United Kingdom keyboard
  ['cs_cz', '00000405'], // Czech keyboard
  ['da_dk', '00000406'], // Danish keyboard
  ['fo_fo', '00000406'], // Danish keyboard
  ['kl_gl', '00000406'], // Danish keyboard
  ['dv_mv', '00000465'], // Divehi Phonetic keyboard
  ['nl_nl', '00020409'], // United States-International keyboard
  ['fy_nl', '00020409'], // United States-International keyboard
  ['nl_be', '00000813'], // Belgian (Period) keyboard
  ['dz_bt', '00000C51'], // Dzongkha keyboard
  ['fr_be', '0000080C'], // Belgian French keyboard
  ['fi_fi', '0000040B'], // Finnish keyboard
  ['en_in', '00004009'], // English (India) keyboard
  ['en_ie', '00001809'], // Irish keyboard
  ['ga_ie', '00001809'], // Irish keyboard
  ['en_nz', '00001409'], // NZ Aotearoa keyboard
  ['sl_si', '00000424'], // Slovenian keyboard
  ['sv_se', '0000041D'], // Swedish keyboard
  ['sv_fi', '0000041D'], // Swedish keyboard
  ['et_ee', '00000425'], // Estonian keyboard
  ['fr_ca', '00001009'], // Canadian French keyboard
  ['fr_lu', '0000100C'], // Swiss French keyboard
  ['fr_ch', '0000100C'], // Swiss French keyboard
  ['it_ch', '0000100C'], // Swiss French keyboard
  ['ff_latn_sn', '00000488'], // Wolof keyboard
  ['wo_sn', '00000488'], // Wolof keyboard
  ['ka_ge', '00010437'], // Georgian (QWERTY) keyboard
  ['de_li', '00000807'], // Swiss German keyboard
  ['de_ch', '00000807'], // Swiss German keyboard
  ['rm_ch', '00000807'], // Swiss German keyboard
  ['el_gr', '00000408'], // Greek keyboard
  ['gn_py', '00000474'], // Guarani keyboard
  ['gu_in', '00000447'], // Gujarati keyboard
  ['ha_latn_ng', '00000468'], // Hausa keyboard
  ['haw_us', '00000475'], // Hawaiian keyboard
  ['he_il', '0002040D'], // Hebrew (Standard) keyboard
  ['hi_in', '00010439'], // Hindi Traditional keyboard
  ['hu_hu', '0000040E'], // Hungarian keyboard
  ['is_is', '0000040F'], // Icelandic keyboard
  ['ig_ng', '00000470'], // Igbo keyboard
  ['iu_latn_ca', '0000085D'], // Inuktitut - Latin keyboard
  ['iu_cans_ca', '0001045D'], // Inuktitut - Naqittaut keyboard
  ['jv_java', '00110C00'], // Javanese keyboard
  ['kn_in', '0000044B'], // Kannada keyboard
  ['ur_pk', '00000420'], // Urdu keyboard
  ['pa_arab_pk', '00000420'], // Urdu keyboard
  ['sd_arab_pk', '00000420'], // Urdu keyboard
  ['ur_in', '00000420'], // Urdu keyboard
  ['kk_kz', '0000043F'], // Kazakh keyboard
  ['km_kh', '00000453'], // Khmer keyboard
  ['ky_kg', '00000440'], // Kyrgyz Cyrillic keyboard
  ['quc_latn_gt', '0000080A'], // Latin American keyboard
  ['arn_cl', '0000080A'], // Latin American keyboard
  ['quz_bo', '0000080A'], // Latin American keyboard
  ['quz_ec', '0000080A'], // Latin American keyboard
  ['quz_pe', '0000080A'], // Latin American keyboard
  ['es_ar', '0000080A'], // Latin American keyboard
  ['es_bo', '0000080A'], // Latin American keyboard
  ['es_cl', '0000080A'], // Latin American keyboard
  ['es_co', '0000080A'], // Latin American keyboard
  ['es_cr', '0000080A'], // Latin American keyboard
  ['es_mx', '0000080A'], // Latin American keyboard
  ['es_do', '0000080A'], // Latin American keyboard
  ['es_ec', '0000080A'], // Latin American keyboard
  ['es_sv', '0000080A'], // Latin American keyboard
  ['es_gt', '0000080A'], // Latin American keyboard
  ['es_hn', '0000080A'], // Latin American keyboard
  ['es_419', '0000080A'], // Latin American keyboard
  ['es_ni', '0000080A'], // Latin American keyboard
  ['es_pa', '0000080A'], // Latin American keyboard
  ['es_py', '0000080A'], // Latin American keyboard
  ['es_pe', '0000080A'], // Latin American keyboard
  ['es_pr', '0000080A'], // Latin American keyboard
  ['es_us', '0000080A'], // Latin American keyboard
  ['es_uy', '0000080A'], // Latin American keyboard
  ['es_ve', '0000080A'], // Latin American keyboard
  ['lo_la', '00000454'], // Lao keyboard
  ['lv_lv', '00020426'], // Latvian (Standard) keyboard
  ['lt_lt', '00010427'], // Lithuanian keyboard
  ['dsb_de', '0002042E'], // Sorbian Standard keyboard
  ['hsb_de', '0002042E'], // Sorbian Standard keyboard
  ['lb_lu', '0000046E'], // Luxembourgish keyboard
  ['mk_mk', '0001042F'], // Macedonian - Standard keyboard
  ['ml_in', '0000044C'], // Malayalam keyboard
  ['mt_mt', '0000043A'], // Maltese 47-Key keyboard
  ['mi_nz', '00000481'], // Maori keyboard
  ['mr_in', '0000044E'], // Marathi keyboard
  ['fa_ir', '00000429'], // Persian keyboard
  ['mn_mn', '00000450'], // Mongolian Cyrillic keyboard
  ['mn_mong_cn', '00010850'], // Traditional Mongolian (Standard) keyboard
  ['mn_mong_mn', '00010850'], // Traditional Mongolian (Standard) keyboard
  ['nqo', '00090C00'], // N’Ko keyboard
  ['ne_np', '00000461'], // Nepali keyboard
  ['ne_in', '00000461'], // Nepali keyboard
  ['se_no', '0000043B'], // Norwegian with Sami keyboard
  ['smj_no', '0000043B'], // Norwegian with Sami keyboard
  ['sma_no', '0000043B'], // Norwegian with Sami keyboard
  ['nb_no', '00000414'], // Norwegian keyboard
  ['nn_no', '00000414'], // Norwegian keyboard
  ['or_in', '00000448'], // Odia keyboard
  ['ps_af', '00000463'], // Pashto (Afghanistan) keyboard
  ['fa_af', '00050429'], // Persian (Standard) keyboard
  ['pl_pl', '00000415'], // Polish (Programmers) keyboard
  ['pt_br', '00000416'], // Portuguese (Brazil ABNT) keyboard
  ['pt_pt', '00000816'], // Portuguese keyboard
  ['pa_in', '00000446'], // Punjabi keyboard
  ['ro_ro', '00010418'], // Romanian (Standard) keyboard
  ['ro_md', '00010418'], // Romanian (Standard) keyboard
  ['sah_ru', '00000485'], // Sakha keyboard
  ['smn_fi', '0001083B'], // Finnish with Sami keyboard
  ['sms_fi', '0001083B'], // Finnish with Sami keyboard
  ['se_fi', '0001083B'], // Finnish with Sami keyboard
  ['smj_se', '0000083B'], // Swedish with Sami keyboard
  ['sma_se', '0000083B'], // Swedish with Sami keyboard
  ['se_se', '0000083B'], // Swedish with Sami keyboard
  ['gd_gb', '00011809'], // Scottish Gaelic keyboard
  ['sr_latn_rs', '0000081A'], // Serbian (Latin) keyboard
  ['sr_latn_ba', '0000081A'], // Serbian (Latin) keyboard
  ['sr_latn_me', '0000081A'], // Serbian (Latin) keyboard
  ['sr_cyrl_rs', '00000C1A'], // Serbian (Cyrillic) keyboard
  ['sr_cyrl_ba', '00000C1A'], // Serbian (Cyrillic) keyboard
  ['sr_cyrl_me', '00000C1A'], // Serbian (Cyrillic) keyboard
  ['nso_za', '0000046C'], // Sesotho sa Leboa keyboard
  ['tn_za', '00000432'], // Setswana keyboard
  ['tn_bw', '00000432'], // Setswana keyboard
  ['si_lk', '0000045B'], // Sinhala keyboard
  ['sk_sk', '0000041B'], // Slovak keyboard
  ['syr_sy', '0000045A'], // Syriac keyboard
  ['tg_cyrl_tj', '00000428'], // Tajik keyboard
  ['ta_in', '00020449'], // Tamil 99 keyboard
  ['ta_lk', '00020449'], // Tamil 99 keyboard
  ['tt_ru', '00010444'], // Tatar keyboard
  ['te_in', '0000044A'], // Telugu keyboard
  ['th_th', '0000041E'], // Thai Kedmanee keyboard
  ['bo_cn', '00010451'], // Tibetan (PRC) - Updated keyboard
  ['tr_tr', '0000041F'], // Turkish Q keyboard
  ['tk_tm', '00000442'], // Turkmen keyboard
  ['uk_ua', '00020422'], // Ukrainian (Enhanced) keyboard
  ['ug_cn', '00010480'], // Uyghur keyboard
  ['uz_cyrl_uz', '00000843'], // Uzbek Cyrillic keyboard
  ['cy_gb', '00000452'], // United Kingdom Extended keyboard
  ['yo_ng', '0000046A'], // Yoruba keyboard
]);

export const keypadLocation = 3;