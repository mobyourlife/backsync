module.exports = () => {};

module.exports.request = (id) => {
	return {
		version: '2.5',
		method: 'GET',
		endpoint: `${id}`,
		fields: [
      // General
      'about',
      'bio',
      'business',
      'description',
      'description_html',
      'category',
      'category_list',
      'contact_address',
      'current_location',
      'general_info',
      'emails',
      'hours',
      'impressum',
      'link',
      'name',
      'name_with_location_descriptor',
      'parking',
      'phone',
      'place_type',
      'single_line_address',
      'store_number',
      'username',
      'website',

      // Flags
      'is_always_open',
      'is_community_page',
      'is_permanently_closed',
      'is_published',
      'is_unclaimed',
      'is_verified',
      'verification_status',

      // Picture
      'cover',

      // Bands
      'band_interests',
      'band_members',
      'booking_agent',
      'hometown',
      'influences',
      'press_contact',
      'record_label',

      // Company
      'company_overview',
      'founded',
      'mission',
      'products',

      // Films
      'directed_by',
      'plot_outline',
      'produced_by',
      'release_date',
      'screenplay_by',
      'starring',
      'studio',

      // Organisations
      'members',

      // People
      'birthday',
      'personal_info',
      'personal_interests',

      // Pharmacies
      'pharma_safety_info',

      // Restaurants
      'culinary_team',
      'food_styles',
      'general_manager',
      'payment_options',
      'price_range', // $ (0-10), $$ (10-30), $$$ (30-50), $$$$ (50+)
      'public_transit',
      'restaurant_services',
      'restaurant_specialties',

      // TV shows
      'network',
      'schedule',
      'season',
      'written_by',

      // Vehicles
      'built',
      'features',
      'mpg'
    ]
	};
};

module.exports.transform = (input) => {
	return {

	};
};
