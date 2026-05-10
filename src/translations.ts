export type Language = 'es' | 'en';

export const translations = {
  es: {
    nav: {
      inicio: 'Inicio',
      carta: 'Carta',
      vermu: 'Vermú',
      ubicacion: 'Ubicación',
      blog: 'Blog',
      reserva: 'Reserva Ahora'
    },
    hero: {
      title: 'Coctelería, Picoteo y Alma junto a la Aljafería',
      subtitle: 'El referente del vermú y la coctelería en La Almozara. Un refugio sofisticado donde el sabor y la historia se encuentran en el corazón de Zaragoza.',
      ctaReserva: 'Reserva tu mesa',
      ctaCarta: 'Explora nuestro menú',
      tooltipReserva: 'Asegura tu lugar hoy',
      tooltipCarta: 'Platos y Cócteles'
    },
    features: {
      tag: 'LA EXPERIENCIA',
      title: 'Nuestros Pilares',
      items: [
        {
          title: "Coctelería de Autor",
          desc: "Mezclas exclusivas diseñadas por nuestros expertos mixólogos, utilizando ingredientes locales y técnicas vanguardistas."
        },
        {
          title: "Picoteo Gourmet",
          desc: "Una selección curada de bocados exquisitos que rinden homenaje a la tradición con un toque de innovación moderna."
        },
        {
          title: "La Terraza",
          desc: "Disfruta de la brisa de Zaragoza en nuestro espacio exterior, con vistas privilegiadas a la historia milenaria de la ciudad."
        },
        {
          title: "Ambiente Acogedor",
          desc: "Un espacio diseñado para el confort, donde la luz tenue y los materiales nobles crean el refugio perfecto."
        }
      ]
    },
    testimonials: {
      tag: 'OPINIONES',
      title: 'Nuestros Clientes Dicen'
    },
    vermu: {
      tag: 'Tradición & Elegancia',
      title: 'El Mejor Vermú de La Almozara',
      subtag: 'EXCLUSIVO FINES DE SEMANA',
      desc: 'Nuestros fines de semana y festivos se visten de gala por la mañana. Disfruta de la luz de Zaragoza con la mejor experiencia de vermú en La Almozara y aperitivos de autor.',
      items: {
        aperol: { name: "Aperol Spritz", desc: "Prosecco, Aperol, soda y rodaja de naranja fresca. El clásico veneciano con nuestro toque local." },
        vermut: { name: "Vermut de Grifo", desc: "Receta artesanal servida con sifón tradicional, hielo, naranja siciliana y aceituna extra." },
        gildas: { name: "Nuestras Gildas", desc: "Piparra de Ibarra, antxoa del Cantábrico y aceituna gordal premium. Un bocado de mar y tierra." },
        patatas: { name: "Patatas Garnish", desc: "Patatas chips artesanas al punto de sal con nuestro aliño secreto de la casa a base de especias locales." }
      },
      cta: 'Reserva tu Vermú',
      viewMenu: 'Ver carta completa de comida',
      note: '* Servicio de vermú disponible los sábados, domingos y festivos nacionales de 11:30 a 14:30.',
      factTitle: '¿Sabías qué?',
      factDesc: 'El Palacio de la Aljafería, situado a pocos pasos de Garnish, es el único palacio musulmán del siglo XI conservado en Europa que sigue en uso. Completa tu mañana de vermú con una visita cultural inolvidable.',
      factCta: 'Reservar visita al Palacio'
    },
    carta: {
      tag: 'DEGUSTACIÓN',
      title: 'Nuestra Selección',
      categories: {
        cocktails: 'Cócteles de Autor',
        picoteo: 'Picoteo Gourmet',
        vinos: 'Vinos y Espumosos',
        granizados: 'Granizados y Frappés',
        dulces: 'Dulces Tentaciones'
      },
      items: {
        cocktails: [
          { name: "Aljafería Gold", desc: "Gin infusionado, licor de saúco, lima y oro comestible." },
          { name: "Zaragoza Mule", desc: "Vodka local, jengibre fresco, menta y un toque de canela." },
          { name: "Noche de Garnish", desc: "Ron añejo, bitters de chocolate, naranja y humo de roble." },
          { name: "Mudejar Sour", desc: "Pisco, sirope de granada, clara de huevo y cardamomo." }
        ],
        picoteo: [
          { name: "Jamón de Bellota", desc: "Corte maestro acompañado de pan de cristal con tomate." },
          { name: "Gildas Garnish", desc: "Nuestra versión premium con anchoa del Cantábrico." },
          { name: "Tabla de Quesos", desc: "Selección de quesos artesanos de Aragón y miel silvestre." }
        ],
        vinos: [
          { name: "Cava Reserva", desc: "Botella. Burbuja fina, notas frutales y frescura persistente." },
          { name: "Tinto D.O. Cariñena", desc: "Copa o botella. Cuerpo intenso con matices de frutos rojos." },
          { name: "Blanco Somontano", desc: "Copa o botella. Aromas florales, seco y muy elegante." },
          { name: "Vermut de Grifo", desc: "Receta tradicional con naranja y aceituna extra." }
        ],
        granizados: [
          { name: "Limón y Albahaca", desc: "Refrescante natural con un toque herbal único." },
          { name: "Frappé de Avellana", desc: "Café premium, leche cremosa y avellana tostada." },
          { name: "Sandía y Menta", desc: "Frescura pura de temporada." }
        ],
        dulces: [
          { name: "Tarta de Queso", desc: "Casera con coulis de frutos rojos del bosque." },
          { name: "Coulant de Chocolate", desc: "Corazón fundente y helado de vainilla." },
          { name: "Sorbete Gin-Tonic", desc: "El postre ideal para los amantes de la ginebra." }
        ]
      },
      download: 'Descargar Carta Completa (PDF)'
    },
    ubicacion: {
      tag: 'UBICACIÓN ÚNICA',
      title: 'A la sombra del Palacio de la Aljafería',
      desc: 'Garnish se encuentra estratégicamente situado a escasos metros de uno de los monumentos más emblemáticos de Zaragoza. Somos el punto de encuentro ideal tras una jornada cultural o para comenzar una noche inolvidable.',
      address: 'Av. de Pablo Gargallo, 19, 50003 Zaragoza, Spain',
      hours: 'Dom-Jue: 11:00 - 00:00 | Vie-Sáb: 11:00 - 02:30'
    },
    blog: {
      tag: 'Crónicas de Garnish',
      title: 'Historias, Selección y Cultura',
      subtitle: 'Descubre los secretos detrás de nuestros cócteles, la historia del palacio y las últimas tendencias en mixología.',
      searchPlaceholder: 'Buscar artículos...',
      noResults: 'No se encontraron artículos que coincidan con tu búsqueda.',
      clearSearch: 'Limpiar búsqueda',
      share: 'COMPARTE ESTA HISTORIA',
      shareText: 'Ayuda a difundir la cultura del vermú',
      backToBlog: 'Volver al blog'
    },
    ctaGlobal: {
      tag: 'Tu opinión nos importa',
      title: '¿Te ha gustado la experiencia?',
      desc: 'Ayúdanos a seguir creciendo compartiendo tu experiencia en Google. ¡Nos encanta leer vuestras reseñas!',
      button: 'Déjanos una reseña',
      readyTitle: '¿Listo para una velada diferente?',
      readyDesc: 'Asegura tu lugar en nuestro refugio de diseño y sabor. Las plazas para las noches de fin de semana suelen agotarse rápido.',
      reserveButton: 'Reserva tu mesa'
    },
    footer: {
      desc: 'Coctelería de autor y gastronomía selecta en un entorno histórico de elegancia nocturna',
      linksTitle: 'ENLACES DE INTERÉS',
      followTitle: 'SÍGUENOS',
      copyright: '© {year} Garnish Bar & Bistro. Av. de Pablo Gargallo, 19, 50003 Zaragoza, Spain. Creado con Elegancia Nocturna.'
    },
    reservation: {
      title: 'Reserva tu mesa',
      subtitle: 'Vive la experiencia Garnish. Asegura tu lugar.',
      successTitle: '¡Reserva Solicitada!',
      successDesc: 'Te enviaremos un correo de confirmación pronto.',
      itemsAdded: 'Items Añadidos',
      nameLabel: 'Nombre Completo',
      namePlaceholder: 'Tu nombre...',
      emailLabel: 'Email de Contacto',
      emailPlaceholder: 'hola@ejemplo.com',
      dateLabel: 'Fecha',
      timeLabel: 'Hora',
      guestsLabel: 'Invitados',
      person: 'Persona',
      personas: 'Personas',
      confirmButton: 'Confirmar Reserva',
      errors: {
        name: 'El nombre es obligatorio',
        email: 'El email es obligatorio',
        emailInvalid: 'Formato de email inválido',
        date: 'La fecha es obligatoria',
        time: 'La hora es obligatoria'
      }
    },
    review: {
      cta: 'Danos tu opinión',
      title: 'Danos tu opinión',
      nameLabel: 'Tu Nombre',
      namePlaceholder: 'Ej. Juan Pérez',
      ratingLabel: 'Valoración',
      commentLabel: 'Tu Comentario',
      commentPlaceholder: 'Cuéntanos tu experiencia...',
      submitButton: 'Enviar Reseña',
      successTitle: '¡Gracias por tu reseña!',
      successDesc: 'Tu opinión nos ayuda a mejorar cada día.'
    },
    blogPosts: [
      {
        title: "Ruta del Vermú por la Almozara: Sabores con Tradición",
        category: "Gastronomía",
        date: "10 May, 2026",
        image: "https://images.unsplash.com/photo-1543736531-29e319409893?auto=format&fit=crop&q=60&w=500",
        excerpt: "La Almozara se consolida como el epicentro del vermú en Zaragoza. De los torreznos del Chicago al toque sofisticado de Garnish.",
        content: `
          <p>Si hay un barrio en Zaragoza que ha sabido mantener viva la llama del vermú tradicional y a la vez renovarse con propuestas de calidad, ese es <strong>La Almozara</strong>. Aquí, el mediodía se convierte en un ritual sagrado de encuentros, risas y, sobre todo, excelencia gastronómica.</p>
          <h3>La Santísima Trinidad del Vermú</h3>
          <p>Nuestra ruta comienza con paradas obligatorias que ya son leyenda en la ciudad. El <strong>Bar Chicago</strong>, conocido por servir el que ha sido premiado como el <em>mejor torrezno del mundo</em>, es el punto de partida perfecto. No se queda atrás el <strong>Cervino</strong>, un templo de las tapas donde la calidad del producto habla por sí sola.</p>
          <h3>Propuestas con Identidad</h3>
          <p>Continuamos hacia <strong>El Gilda</strong>, donde el nombre ya nos da una pista de su especialidad, ejecutada a la perfección. Para aquellos que buscan un ambiente más bohemio y artístico, <strong>Matisse</strong> ofrece ese rincón especial donde el vermú se acompaña de cultura.</p>
          <h3>El Toque Final en Garnish</h3>
          <p>Y como broche de oro a una mañana perfecta por el barrio, te invitamos a <strong>Garnish</strong>. Ubicados junto a la Aljafería, elevamos la experiencia del vermú con nuestra selección de macerados artesanales y un picoteo gourmet diseñado para sorprender. Porque en La Almozara, sabemos que el buen beber merece el mejor entorno.</p>
          <p>Ven a descubrir por qué nuestro barrio es, hoy por hoy, el mejor destino para los amantes del vermú.</p>
        `
      },
      {
        title: "Tardeo en Zaragoza: El Fenómeno que Transforma nuestras Tardes",
        category: "Cultura",
        date: "15 May, 2026",
        image: "https://images.unsplash.com/photo-1541532713592-6628edcc273c?auto=format&fit=crop&q=60&w=500",
        excerpt: "Zaragoza se ha convertido en la capital del tardeo. Descubre por qué Garnish es el lugar ideal para disfrutar de esta tradición junto a la Aljafería.",
        content: `
          <p>El <strong>tardeo</strong> en Zaragoza no es solo una moda, es un estilo de vida que ha transformado nuestras tardes de fin de semana. Lo que empezó como una alternativa a las noches largas se ha convertido en el momento favorito de muchos para socializar, disfrutar y saborear la ciudad.</p>
          <h3>¿Por qué Zaragoza es la capital del Tardeo?</h3>
          <p>Nuestra ciudad respira un ambiente único cuando el sol empieza a bajar. La mezcla de cultura, buen clima (especialmente en primavera y otoño) y la hospitalidad zaragozana hacen que salir a disfrutar antes de la cena sea irresistible.</p>
          <h3>Garnish: Tu Refugio en el Tardeo</h3>
          <p>Ubicados frente a la majestuosa <strong>Aljafería</strong>, en Garnish ofrecemos un tardeo diferente. Lejos de las aglomeraciones del centro, nuestro espacio invita a una conversación relajada acompañada de coctelería de autor y picoteo gourmet.</p>
          <h3>Recomendaciones del Bartender</h3>
          <p>Para estas horas, recomendamos cócteles más refrescantes y ligeros. Un Spritz con nuestro toque personal o un Gin-Tonic cítrico son los aliados perfectos mientras contemplas los tonos dorados que el atardecer regala a las murallas del palacio.</p>
          <p>¡Te esperamos en Garnish para vivir el mejor tardeo de la ciudad!</p>
        `
      },
      {
        title: "El Arte del Garnish: Más que una Decoración",
        category: "Filosofía",
        date: "14 May, 2026",
        image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=60&w=500",
        excerpt: "Descubre el significado del garnish, su importancia vital en la experiencia sensorial y cómo define el alma de cada una de nuestras bebidas.",
        content: `
          <p>En **Garnish**, creemos que la coctelería es una forma de arte que va mucho más allá de la simple mezcla de ingredientes. Como nuestro propio nombre indica, el <strong>garnish</strong> (o la decoración) no es un añadido superficial, sino el toque final que otorga alma y carácter a la bebida.</p>
          <h3>La Primera Impresión</h3>
          <p>Un cóctel se bebe primero con los ojos. Un garnish bien ejecutado prepara el paladar y crea una expectativa sensorial única. Ya sea una ramita de albahaca fresca en un granizado o una sutil piel de naranja quemada en un Old Fashioned, cada elemento tiene una razón de ser.</p>
          <h3>Aromas y Sabores</h3>
          <p>El garnish aporta aceites esenciales y aromas que transforman la experiencia. La frescura de la menta, el aroma cítrico del limón o el toque herbal del romero no solo decoran, sino que elevan los botánicos de la bebida a un nuevo nivel.</p>
          <p>Visítanos y descubre cómo cuidamos cada detalle para que tu experiencia en Garnish sea inolvidable.</p>
        `
      },
      {
        title: "El arte de la Ginebra en Zaragoza",
        category: "Mixología",
        date: "12 May, 2026",
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=60&w=500",
        excerpt: "Exploramos cómo los botánicos locales han transformado la escena de la coctelería en nuestra ciudad.",
        content: `
          <p>Zaragoza ha vivido una auténtica revolución en el mundo de la ginebra. Lo que antes era una bebida clásica, hoy se ha convertido en un lienzo para la innovación y la expresión de sabores locales.</p>
          <h3>Botánicos del Ebro</h3>
          <p>En Garnish, nos gusta experimentar con botánicos que crecen en nuestra región. La proximidad nos permite utilizar ingredientes de una frescura inigualable, aportando notas que solo encontrarás en el valle del Ebro.</p>
          <h3>Nuestros Gin-Tonics</h3>
          <p>Cada una de nuestras ginebras se sirve con una tónica premium seleccionada específicamente para potenciar sus notas de cata. El servicio es todo un ritual: enfriado de la copa, selección del garnish perfecto y vertido pausado para mantener la burbuja.</p>
          <p>Ven a probar nuestra selección y déjate guiar por nuestros bartenders.</p>
        `
      },
      {
        title: "Secretos de la Aljafería Nocturna",
        category: "Cultura",
        date: "08 May, 2026",
        image: "https://images.unsplash.com/photo-1628155255476-880be9087c54?auto=format&fit=crop&q=60&w=500",
        excerpt: "La magia de cenar a la sombra de un palacio milenario. Un recorrido por la historia que nos rodea.",
        content: `
          <p>Estar situados frente a la Aljafería no es solo una cuestión de ubicación, es una cuestión de atmósfera. Por la noche, el palacio se ilumina y crea un telón de fondo digno de las Mil y Una Noches.</p>
          <h3>Un Entorno con Historia</h3>
          <p>El palacio de la Aljafería es un testimonio vivo del pasado árabe de Zaragoza. Sus arcos de herradura y sus jardines inspiran la elegancia y el misterio que intentamos transmitir en cada rincón de nuestro local.</p>
          <h3>Cenas Bajo la Luna</h3>
          <p>Disfrutar de un cóctel en nuestra terraza mientras contemplas las murallas del palacio es una experiencia que todo zaragozano y visitante debería vivir al menos una vez. Es el momento donde el tiempo parece detenerse.</p>
          <p>Te invitamos a vivir esta magia nocturna con nosotros.</p>
        `
      },
      {
        title: "Maridaje: Tapas y Cócteles de Autor",
        category: "Gastronomía",
        date: "02 May, 2026",
        image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=60&w=500",
        excerpt: "Nuestra guía definitiva para encontrar el equilibrio perfecto entre sabores gourmet y mezclas exclusivas.",
        content: `
          <p>El maridaje no es exclusivo del vino. Un buen cóctel puede potenciar y ser potenciado por un bocado gourmet si se eligen los perfiles de sabor adecuados.</p>
          <h3>Contrarios que se Atráen</h3>
          <p>Un cóctel cítrico y refrescante como nuestro Mudejar Sour corta perfectamente la grasitud de nuestro Jamón de Bellota, limpiando el paladar para cada bocado.</p>
          <h3>Armonía de Sabores</h3>
          <p>Nuestras tablas de quesos artesanos encuentran su pareja ideal en la profundidad de la Noche de Garnish, creando una armonía de notas terrosas y ahumadas.</p>
          <p>En Garnish, te asesoramos para que encuentres el maridaje perfecto para tu paladar.</p>
        `
      }
    ]
  },
  en: {
    nav: {
      inicio: 'Home',
      carta: 'Menu',
      vermu: 'Vermouth',
      ubicacion: 'Location',
      blog: 'Blog',
      reserva: 'Book Now'
    },
    hero: {
      title: 'Cocktails, Tapas and Soul by the Aljafería',
      subtitle: 'Reference for vermouth and cocktails in La Almozara. A sophisticated shelter where flavor and history meet in the heart of Zaragoza.',
      ctaReserva: 'Book your table',
      ctaCarta: 'Explore our menu',
      tooltipReserva: 'Secure your spot today',
      tooltipCarta: 'Dishes and Cocktails'
    },
    features: {
      tag: 'THE EXPERIENCE',
      title: 'Our Pillars',
      items: [
        {
          title: "Signature Cocktails",
          desc: "Exclusive blends designed by our expert mixologists, using local ingredients and avant-garde techniques."
        },
        {
          title: "Gourmet Tapas",
          desc: "A curated selection of exquisite bites that pay tribute to tradition with a touch of modern innovation."
        },
        {
          title: "The Terrace",
          desc: "Enjoy the breeze of Zaragoza in our outdoor space, with privileged views of the city's millenary history."
        },
        {
          title: "Cozy Atmosphere",
          desc: "A space designed for comfort, where dim light and noble materials create the perfect shelter."
        }
      ]
    },
    testimonials: {
      tag: 'REVIEWS',
      title: 'What Our Clients Say'
    },
    vermu: {
      tag: 'Tradition & Elegance',
      title: 'The Best Vermouth in La Almozara',
      subtag: 'EXCLUSIVE WEEKENDS',
      desc: 'Our weekends and holidays dress up in the morning. Enjoy the light of Zaragoza with the best vermouth experience in La Almozara and signature appetizers.',
      items: {
        aperol: { name: "Aperol Spritz", desc: "Prosecco, Aperol, soda and fresh orange slice. The classic Venetian with our local touch." },
        vermut: { name: "Draught Vermouth", desc: "Artisanal recipe served with traditional siphon, ice, Sicilian orange and extra olive." },
        gildas: { name: "Our Gildas", desc: "Ibarra chili, Cantabrian anchovy and premium gordal olive. A bite of sea and land." },
        patatas: { name: "Garnish Potatoes", desc: "Handmade potato chips with salt and our secret house dressing based on local spices." }
      },
      cta: 'Book your Vermouth',
      viewMenu: 'View full food menu',
      note: '* Vermouth service available on Saturdays, Sundays and national holidays from 11:30 to 14:30.',
      factTitle: 'Did you know?',
      factDesc: 'The Aljafería Palace, located steps away from Garnish, is the only 11th-century Muslim palace preserved in Europe that is still in use. Complete your vermouth morning with an unforgettable cultural visit.',
      factCta: 'Book Palace visit'
    },
    carta: {
      tag: 'TASTING',
      title: 'Our Selection',
      categories: {
        cocktails: 'Signature Cocktails',
        picoteo: 'Gourmet Tapas',
        vinos: 'Wines and Sparkling',
        granizados: 'Slushes and Frappes',
        dulces: 'Sweet Temptations'
      },
      items: {
        cocktails: [
          { name: "Aljafería Gold", desc: "Infused gin, elderflower liqueur, lime and edible gold." },
          { name: "Zaragoza Mule", desc: "Local vodka, fresh ginger, mint and a touch of cinnamon." },
          { name: "Garnish Night", desc: "Aged rum, chocolate bitters, orange and oak smoke." },
          { name: "Mudejar Sour", desc: "Pisco, pomegranate syrup, egg white and cardamom." }
        ],
        picoteo: [
          { name: "Acorn-fed Ham", desc: "Master cut accompanied by glass bread with tomato." },
          { name: "Garnish Gildas", desc: "Our premium version with Cantabrian anchovy." },
          { name: "Cheese Platter", desc: "Selection of artisan cheeses from Aragon and wild honey." }
        ],
        vinos: [
          { name: "Cava Reserva", desc: "Bottle. Fine bubbles, fruity notes and persistent freshness." },
          { name: "Red Wine D.O. Cariñena", desc: "Glass or bottle. Intense body with hints of red fruits." },
          { name: "White Wine Somontano", desc: "Glass or bottle. Floral aromas, dry and very elegant." },
          { name: "Draught Vermouth", desc: "Traditional recipe with orange and extra olive." }
        ],
        granizados: [
          { name: "Lemon and Basil", desc: "Natural refreshing with a unique herbal touch." },
          { name: "Hazelnut Frappe", desc: "Premium coffee, creamy milk and toasted hazelnut." },
          { name: "Watermelon and Mint", desc: "Pure seasonal freshness." }
        ],
        dulces: [
          { name: "Cheesecake", desc: "Homemade with wild red berry coulis." },
          { name: "Chocolate Coulant", desc: "Molten heart and vanilla ice cream." },
          { name: "Gin-Tonic Sorbet", desc: "The ideal dessert for gin lovers." }
        ]
      },
      download: 'Download Full Menu (PDF)'
    },
    ubicacion: {
      tag: 'UNIQUE LOCATION',
      title: 'In the shadow of the Aljafería Palace',
      desc: 'Garnish is strategically located meters away from one of Zaragoza\'s most iconic monuments. We are the ideal meeting point after a cultural day or to start an unforgettable night.',
      address: 'Av. de Pablo Gargallo, 19, 50003 Zaragoza, Spain',
      hours: 'Sun-Thu: 11:00 - 00:00 | Fri-Sat: 11:00 - 02:30'
    },
    blog: {
      tag: 'Garnish Chronicles',
      title: 'Stories, Selection and Culture',
      subtitle: 'Discover the secrets behind our cocktails, the palace\'s history and the latest mixology trends.',
      searchPlaceholder: 'Search articles...',
      noResults: 'No articles were found matching your search.',
      clearSearch: 'Clear search',
      share: 'SHARE THIS STORY',
      shareText: 'Help spread the vermouth culture',
      backToBlog: 'Back to blog'
    },
    ctaGlobal: {
      tag: 'Your opinion matters',
      title: 'Did you like the experience?',
      desc: 'Help us keep growing by sharing your experience on Google. We love reading your reviews!',
      button: 'Leave us a review',
      readyTitle: 'Ready for a different evening?',
      readyDesc: 'Secure your spot in our shelter of design and flavor. Weekend night spots usually sell out fast.',
      reserveButton: 'Book your table'
    },
    footer: {
      desc: 'Signature cocktails and select gastronomy in a historical setting of nocturnal elegance',
      linksTitle: 'INTEREST LINKS',
      followTitle: 'FOLLOW US',
      copyright: '© {year} Garnish Bar & Bistro. Av. de Pablo Gargallo, 19, 50003 Zaragoza, Spain. Created with Nocturnal Elegance.'
    },
    reservation: {
      title: 'Book your table',
      subtitle: 'Live the Garnish experience. Secure your spot.',
      successTitle: 'Reservation Requested!',
      successDesc: 'We will send you a confirmation email soon.',
      itemsAdded: 'Items Added',
      nameLabel: 'Full Name',
      namePlaceholder: 'Your name...',
      emailLabel: 'Contact Email',
      emailPlaceholder: 'hello@example.com',
      dateLabel: 'Date',
      timeLabel: 'Time',
      guestsLabel: 'Guests',
      person: 'Person',
      personas: 'People',
      confirmButton: 'Confirm Reservation',
      errors: {
        name: 'Name is required',
        email: 'Email is required',
        emailInvalid: 'Invalid email format',
        date: 'Date is required',
        time: 'Time is required'
      }
    },
    review: {
      cta: 'Give us your opinion',
      title: 'Give us your opinion',
      nameLabel: 'Your Name',
      namePlaceholder: 'e.g. John Doe',
      ratingLabel: 'Rating',
      commentLabel: 'Your Comment',
      commentPlaceholder: 'Tell us about your experience...',
      submitButton: 'Send Review',
      successTitle: 'Thanks for your review!',
      successDesc: 'Your opinion helps us improve every day.'
    },
    blogPosts: [
      {
        title: "Vermouth Route through La Almozara: Flavors with Tradition",
        category: "Gastronomy",
        date: "May 10, 2026",
        image: "https://images.unsplash.com/photo-1543736531-29e319409893?auto=format&fit=crop&q=60&w=500",
        excerpt: "La Almozara is consolidated as the epicenter of vermouth in Zaragoza. From Chicago's 'torreznos' to Garnish's sophisticated touch.",
        content: `
          <p>If there is a neighborhood in Zaragoza that has managed to keep the flame of traditional vermouth alive and at the same time renew itself with quality proposals, that is <strong>La Almozara</strong>. Here, midday becomes a sacred ritual of encounters, laughter and, above all, gastronomic excellence.</p>
          <h3>The Holy Trinity of Vermouth</h3>
          <p>Our route begins with mandatory stops that are already legendary in the city. The <strong>Bar Chicago</strong>, known for serving what has been awarded as the <em>best torrezno in the world</em>, is the perfect starting point. Not far behind is the <strong>Cervino</strong>, a tapas temple where the quality of the product speaks for itself.</p>
          <h3>Proposals with Identity</h3>
          <p>We continue towards <strong>El Gilda</strong>, where the name already gives us a hint of its specialty, executed to perfection. For those looking for a more bohemian and artistic atmosphere, <strong>Matisse</strong> offers that special corner where vermouth is accompanied by culture.</p>
          <h3>The Final Touch at Garnish</h3>
          <p>And as a finishing touch to a perfect morning through the neighborhood, we invite you to <strong>Garnish</strong>. Located next to the Aljafería, we elevate the vermouth experience with our selection of artisanal macerates and a gourmet snack designed to surprise. Because in La Almozara, we know that good drinking deserves the best environment.</p>
          <p>Come and discover why our neighborhood is, today, the best destination for vermouth lovers.</p>
        `
      },
      {
        title: "Tardeo in Zaragoza: The Phenomenon that Transforms our Afternoons",
        category: "Culture",
        date: "May 15, 2026",
        image: "https://images.unsplash.com/photo-1541532713592-6628edcc273c?auto=format&fit=crop&q=60&w=500",
        excerpt: "Zaragoza has become the capital of 'tardeo'. Discover why Garnish is the ideal place to enjoy this tradition next to the Aljafería.",
        content: `
          <p>The <strong>tardeo</strong> in Zaragoza is not just a fashion, it is a lifestyle that has transformed our weekend afternoons. What started as an alternative to long nights has become the favorite moment for many to socialize, enjoy and savor the city.</p>
          <h3>Why is Zaragoza the capital of Tardeo?</h3>
          <p>Our city breathes a unique atmosphere when the sun starts to go down. The mix of culture, good weather (especially in spring and autumn) and Zaragozan hospitality make going out to enjoy before dinner irresistible.</p>
          <h3>Garnish: Your Shelter in the Afternoons</h3>
          <p>Located in front of the majestic <strong>Aljafería</strong>, at Garnish we offer a different 'tardeo'. Far from the crowds of the center, our space invites a relaxed conversation accompanied by signature cocktails and gourmet snacks.</p>
          <h3>Bartender's Recommendations</h3>
          <p>For these hours, we recommend more refreshing and light cocktails. A Spritz with our personal touch or a citrus Gin-Tonic are the perfect allies while contemplating the golden tones that the sunset gives to the palace walls.</p>
          <p>We wait for you at Garnish to experience the best 'tardeo' in the city!</p>
        `
      },
      {
        title: "The Art of Garnish: More than just a Decoration",
        category: "Philosophy",
        date: "May 14, 2026",
        image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=60&w=500",
        excerpt: "Discover the meaning of garnish, its vital importance in the sensory experience and how it defines the soul of each of our drinks.",
        content: `
          <p>In **Garnish**, we believe that mixology is a form of art that goes far beyond the simple mixing of ingredients. As our own name indicates, the <strong>garnish</strong> (or decoration) is not a superficial addition, but the final touch that gives soul and character to the drink.</p>
          <h3>The First Impression</h3>
          <p>A cocktail is drunk first with the eyes. A well-executed garnish prepares the palate and creates a unique sensory expectation. Whether it's a sprig of fresh basil in a slush or a subtle burnt orange peel in an Old Fashioned, each element has a reason for being.</p>
          <h3>Aromas and Flavors</h3>
          <p>The garnish brings essential oils and aromas that transform the experience. The freshness of mint, the citrus aroma of lemon or the herbal touch of rosemary not only decorate, but elevate the drink's botanicals to a new level.</p>
          <p>Visit us and discover how we take care of every detail to make your experience at Garnish unforgettable.</p>
        `
      },
      {
        title: "The Art of Gin in Zaragoza",
        category: "Mixology",
        date: "May 12, 2026",
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=60&w=500",
        excerpt: "We explore how local botanicals have transformed the cocktail scene in our city.",
        content: `
          <p>Zaragoza has lived a true revolution in the world of gin. What was once a classic drink has today become a canvas for innovation and the expression of local flavors.</p>
          <h3>Ebro Botanicals</h3>
          <p>At Garnish, we like to experiment with botanicals that grow in our region. Proximity allows us to use ingredients of unmatched freshness, providing notes that you will only find in the Ebro valley.</p>
          <h3>Our Gin-Tonics</h3>
          <p>Each of our gins is served with a premium tonic specifically selected to enhance its tasting notes. The service is a whole ritual: cooling the glass, selecting the perfect garnish and pouring slowly to maintain the bubble.</p>
          <p>Come try our selection and let our bartenders guide you.</p>
        `
      },
      {
        title: "Secrets of Aljafería by Night",
        category: "Culture",
        date: "May 08, 2026",
        image: "https://images.unsplash.com/photo-1628155255476-880be9087c54?auto=format&fit=crop&q=60&w=500",
        excerpt: "The magic of dining in the shadow of a thousand-year-old palace. A tour through the history that surrounds us.",
        content: `
          <p>Being located in front of the Aljafería is not just a matter of location, it is a matter of atmosphere. At night, the palace lights up and creates a backdrop worthy of the Arabian Nights.</p>
          <h3>A Setting with History</h3>
          <p>The Aljafería palace is a living testimony of Zaragoza's Arab past. Its horseshoe arches and its gardens inspire the elegance and mystery that we try to transmit in every corner of our place.</p>
          <h3>Moonlit Dinners</h3>
          <p>Enjoying a cocktail on our terrace while contemplating the palace walls is an experience that every zaragozano and visitor should experience at least once. It is the moment where time seems to stand still.</p>
          <p>We invite you to experience this nocturnal magic with us.</p>
        `
      },
      {
        title: "Pairing: Tapas and Signature Cocktails",
        category: "Gastronomy",
        date: "May 02, 2026",
        image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=60&w=500",
        excerpt: "Our definitive guide to finding the perfect balance between gourmet flavors and exclusive mixes.",
        content: `
          <p>Pairing is not exclusive to wine. A good cocktail can enhance and be enhanced by a gourmet bite if the right flavor profiles are chosen.</p>
          <h3>Opposites Attract</h3>
          <p>A citrus and refreshing cocktail like our Mudejar Sour perfectly cuts through the fattiness of our Acorn-fed Ham, cleansing the palate for each bite.</p>
          <h3>Harmony of Flavors</h3>
          <p>Our artisan cheese platters find their ideal partner in the depth of Garnish Night, creating a harmony of earthy and smoky notes.</p>
          <p>At Garnish, we advise you to find the perfect pairing for your palate.</p>
        `
      }
    ]
  }
};
