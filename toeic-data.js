/* Anglais pro : banque d'entraînement TOEIC (questions originales, format de l'examen) */
(function () {
  'use strict';
  // Partie 5 : phrase à compléter. [catégorie, phrase, bonne réponse, 3 pièges, explication]
  const P5 = [
    ['Forme du mot', 'The marketing team presented a ___ proposal to the board.', 'detailed', 'detail', 'detailing', 'details', 'Il faut un adjectif devant le nom « proposal » : detailed (détaillée).'],
    ['Forme du mot', 'Ms. Lee handled the negotiation very ___.', 'professionally', 'professional', 'profession', 'professionalism', 'On complète un verbe avec un adverbe (-ly) : « very professionally ».'],
    ['Forme du mot', 'The ___ of the new software will take two weeks.', 'installation', 'install', 'installed', 'installs', 'Après « the » et avant « of », il faut un nom : installation.'],
    ['Forme du mot', 'We are ___ to announce a partnership with Northwind.', 'pleased', 'please', 'pleasing', 'pleasure', '« Be pleased to + verbe » : nous avons le plaisir de.'],
    ['Forme du mot', 'Sales were ___ higher than expected in the third quarter.', 'significantly', 'significant', 'signify', 'significance', 'Un adverbe modifie un adjectif comparatif (higher) : significantly.'],
    ['Forme du mot', 'Employees are ___ for submitting their timesheets by Friday.', 'responsible', 'respond', 'responsibly', 'responsibility', '« Be responsible for » : être responsable de. Après « are », un adjectif.'],
    ['Forme du mot', 'The manager gave a clear ___ of the new procedure.', 'explanation', 'explain', 'explained', 'explaining', 'Après « a clear », il faut un nom : explanation.'],
    ['Forme du mot', 'Her ___ to the project was recognized by the director.', 'contribution', 'contribute', 'contributing', 'contributed', 'Après un possessif (her), on attend un nom : contribution.'],

    ['Prépositions', 'The meeting has been rescheduled ___ Thursday.', 'for', 'in', 'since', 'during', '« For + jour » indique la date prévue d’un événement.'],
    ['Prépositions', 'Please submit your report ___ the end of the week.', 'by', 'until', 'during', 'since', '« By » = au plus tard à une échéance. « Until » exprime une durée continue.'],
    ['Prépositions', 'The new branch will open ___ March.', 'in', 'on', 'at', 'to', '« In » devant un mois ; « on » devant un jour précis.'],
    ['Prépositions', 'Ms. Garcia is responsible ___ the Asian market.', 'for', 'of', 'to', 'with', 'Construction fixe : be responsible for.'],
    ['Prépositions', 'We are looking forward ___ working with you.', 'to', 'for', 'at', 'on', '« Look forward to » est suivi de -ing : to est ici une préposition.'],
    ['Prépositions', 'The conference will take place ___ the Hilton Hotel.', 'at', 'during', 'since', 'between', '« At » devant un lieu précis (établissement).'],
    ['Prépositions', 'The price is ___ to change without notice.', 'subject', 'related', 'close', 'equal', '« Subject to change » : sous réserve de modification.'],
    ['Prépositions', 'She has worked here ___ 2015.', 'since', 'for', 'from', 'during', '« Since » + point de départ (2015). « For » + durée (for ten years).'],

    ['Conjonctions et connecteurs', '___ the weather was bad, the event went ahead as planned.', 'Although', 'Because', 'Unless', 'Therefore', '« Although » introduit une opposition (bien que).'],
    ['Conjonctions et connecteurs', 'Please call me ___ you have any questions.', 'if', 'unless', 'although', 'so', '« If » exprime la condition. « Unless » = à moins que.'],
    ['Conjonctions et connecteurs', 'The shipment was delayed ___ a strike at the port.', 'because of', 'because', 'although', 'so that', '« Because of » est suivi d’un nom ; « because » d’une proposition.'],
    ['Conjonctions et connecteurs', 'We will start the meeting ___ everyone arrives.', 'as soon as', 'whereas', 'despite', 'in spite', '« As soon as » = dès que.'],
    ['Conjonctions et connecteurs', '___ the new policy, employees must now log their hours.', 'Under', 'Among', 'Beyond', 'Besides', '« Under a policy / contract / law » : selon, conformément à.'],
    ['Conjonctions et connecteurs', 'The product is expensive; ___, it is very reliable.', 'however', 'so that', 'whether', 'provided', '« However » marque le contraste entre deux phrases.'],
    ['Conjonctions et connecteurs', 'You can work remotely ___ you finish your tasks on time.', 'as long as', 'in spite of', 'whereas', 'instead of', '« As long as » = à condition que.'],
    ['Conjonctions et connecteurs', 'Neither the manager ___ the assistants were informed.', 'nor', 'or', 'and', 'but', 'Corrélation : neither ... nor.'],

    ['Temps et voix', 'By the time we arrived, the presentation ___.', 'had started', 'has started', 'starts', 'will start', '« By the time » + passé : l’action antérieure est au plus-que-parfait.'],
    ['Temps et voix', 'The report ___ by the finance team next week.', 'will be completed', 'will complete', 'completes', 'has completed', 'Le rapport subit l’action : futur passif (will be + participe).'],
    ['Temps et voix', 'Mr. Park ___ in the sales department for ten years.', 'has worked', 'works', 'is working', 'will work', '« For + durée » avec un état qui continue : present perfect.'],
    ['Temps et voix', 'If we ___ the deal, we will hire three more people.', 'win', 'won', 'would win', 'are winning', 'Condition réelle : if + présent, will + verbe.'],
    ['Temps et voix', 'The invoices ___ yet.', 'have not been sent', 'have not sent', 'did not sent', 'not been sent', 'Sujet = les factures (passif) ; « yet » appelle le present perfect.'],
    ['Temps et voix', 'Please ___ the attached file before the meeting.', 'review', 'reviewing', 'to review', 'reviewed', 'Impératif après « please » : verbe à l’infinitif sans to.'],
    ['Temps et voix', 'The CEO asked that every employee ___ the training.', 'attend', 'attends', 'attended', 'attending', 'Après « ask / require / recommend that », on emploie la base verbale.'],
    ['Temps et voix', 'We ___ for the contract when the client called.', 'were preparing', 'prepared', 'have prepared', 'prepare', 'Action en cours interrompue par une autre : past continuous.'],

    ['Vocabulaire en contexte', 'The company plans to ___ its operations to Asia next year.', 'expand', 'expose', 'explain', 'extract', 'Expand = étendre, développer (une activité).'],
    ['Vocabulaire en contexte', 'All applicants must ___ a résumé and two references.', 'submit', 'permit', 'admit', 'commit', 'Submit = soumettre, remettre un dossier.'],
    ['Vocabulaire en contexte', 'The new manager will ___ the team of six sales representatives.', 'supervise', 'supply', 'suppose', 'survive', 'Supervise = superviser, encadrer.'],
    ['Vocabulaire en contexte', 'Our supplier offers a 10 percent ___ on orders over $5,000.', 'discount', 'distance', 'decision', 'division', 'Discount = remise.'],
    ['Vocabulaire en contexte', 'Due to budget ___, the project has been postponed.', 'constraints', 'conversations', 'contributions', 'consequences', 'Budget constraints = contraintes budgétaires.'],
    ['Vocabulaire en contexte', 'The warranty ___ all repairs during the first year.', 'covers', 'holds', 'takes', 'makes', 'Une garantie « covers » (couvre) les réparations.'],
    ['Vocabulaire en contexte', 'The contract ___ on December 31.', 'expires', 'ends up', 'closes down', 'runs out of', 'Un contrat « expires » (arrive à échéance). « Run out of » demande un complément.'],
    ['Vocabulaire en contexte', 'He was ___ to the position of regional director.', 'promoted', 'proposed', 'produced', 'professed', 'Be promoted to = être promu à un poste.'],

    ['Pronoms et déterminants', 'Employees must bring ___ own laptops.', 'their', 'them', 'theirs', 'they', 'Devant un nom, il faut un adjectif possessif : their.'],
    ['Pronoms et déterminants', 'The manager ___ designed the system will give a demo.', 'who', 'whom', 'whose', 'which', 'Le sujet est une personne : who.'],
    ['Pronoms et déterminants', 'The report, ___ was published last week, shows strong growth.', 'which', 'who', 'what', 'whose', 'Une chose + virgule : which.'],
    ['Pronoms et déterminants', 'There are ___ seats left for the seminar.', 'few', 'little', 'much', 'a little', 'Seats est dénombrable pluriel : few.'],
    ['Pronoms et déterminants', '___ of the two proposals was accepted.', 'Neither', 'Both', 'Several', 'Many', 'Sujet singulier (was) parmi deux : neither.'],
    ['Pronoms et déterminants', 'We need ___ information before making a decision.', 'more', 'many', 'few', 'several', '« Information » est indénombrable : more (et non many).'],
    ['Pronoms et déterminants', 'Ms. Kim and I finished the project by ___.', 'ourselves', 'us', 'we', 'our', 'Pronom réfléchi : by ourselves = tout seuls.'],
    ['Pronoms et déterminants', 'The clients were pleased with ___ they saw.', 'what', 'which', 'who', 'whose', '« What » = ce que (pronom relatif sans antécédent).'],

    ['Comparaison et quantité', 'This year’s profits are ___ than last year’s.', 'higher', 'high', 'highest', 'more high', 'Comparatif de supériorité suivi de « than » : higher.'],
    ['Comparaison et quantité', 'It is the ___ expensive model in our catalog.', 'most', 'more', 'much', 'very', 'Superlatif après « the » : the most expensive.'],
    ['Comparaison et quantité', 'The new system is ___ as efficient as the old one.', 'twice as', 'twice more', 'as twice', 'more twice', 'Multiplicateur + as ... as : twice as efficient as.'],
    ['Comparaison et quantité', 'We received ___ applications than we expected.', 'more', 'most', 'many', 'much', '« Than » appelle un comparatif : more.'],
    ['Comparaison et quantité', 'The ___ the delivery, the higher the fee.', 'faster', 'fast', 'fastest', 'more fast', 'Structure the + comparatif, the + comparatif.'],
    ['Comparaison et quantité', 'Only ___ of the staff attended the training.', 'a few', 'a little', 'much', 'every', '« A few of » + nom pluriel : quelques-uns.'],
    ['Comparaison et quantité', 'Sales increased by ___ 12 percent.', 'nearly', 'near', 'nearest', 'nearby', 'Adverbe devant un chiffre : nearly = presque.'],
    ['Comparaison et quantité', 'Of all the candidates, Ms. Chen has the ___ experience.', 'most', 'more', 'much', 'mostly', 'Superlatif parmi plusieurs : the most experience.']
  ];

  // Partie 2 : question puis trois réponses (la première est la bonne). [catégorie, question, bonne, piège 1, piège 2]
  const P2 = [
    ['Question en Wh-', 'Who is leading the budget meeting?', 'Ms. Alvarez is.', 'At two o’clock.', 'In the conference room.'],
    ['Question en Wh-', 'When is the report due?', 'By Friday afternoon.', 'Yes, I read it.', 'In the sales folder.'],
    ['Question en Wh-', 'Where can I find the printer paper?', 'In the supply cabinet.', 'At about noon.', 'It was very expensive.'],
    ['Question en Wh-', 'Why was the shipment delayed?', 'There was a problem at customs.', 'About five boxes.', 'Next Tuesday, I think.'],
    ['Question en Wh-', 'How many people are attending the workshop?', 'Around thirty.', 'Every Monday.', 'In the main hall.'],
    ['Question en Wh-', 'What time does the train to Lyon leave?', 'At a quarter past nine.', 'For two weeks.', 'It’s very crowded.'],
    ['Question en Wh-', 'How long will the renovation take?', 'About three weeks.', 'It’s quite modern.', 'Every Thursday.'],
    ['Question en Wh-', 'Who should I send the expense report to?', 'The accounting department.', 'Last month’s.', 'By express mail, please.'],
    ['Demande et proposition', 'Would you like to review the contract now or later?', 'Later would be better.', 'Yes, it was signed.', 'Over there, please.'],
    ['Demande et proposition', 'Could you help me with this presentation?', 'Sure, what do you need?', 'It lasts an hour.', 'The projector is new.'],
    ['Demande et proposition', 'Should we order lunch for the meeting?', 'Good idea, I’ll call the caterer.', 'No, it wasn’t long.', 'At the new restaurant.'],
    ['Demande et proposition', 'Why don’t we postpone the launch until next month?', 'That would give us more time to test.', 'It’s on the left.', 'No, I launched it.'],
    ['Demande et proposition', 'Would you mind closing the window?', 'Not at all.', 'It’s on the table.', 'Yes, I closed it yesterday.'],
    ['Question oui/non et tags', 'Haven’t you sent the invoice yet?', 'I’ll do it this afternoon.', 'It’s on the second floor.', 'No, he doesn’t.'],
    ['Question oui/non et tags', 'The client wants a discount, doesn’t he?', 'Yes, ten percent.', 'Next to the entrance.', 'I counted it twice.'],
    ['Question oui/non et tags', 'Is the conference room available this afternoon?', 'It’s booked until three.', 'It’s a long conference.', 'Yes, I’m a manager.'],
    ['Question oui/non et tags', 'Didn’t the training start at ten?', 'No, it was moved to eleven.', 'About twenty participants.', 'In the lobby, I think.'],
    ['Réponses indirectes', 'Do you know who is replacing Mr. Davis?', 'They haven’t announced it yet.', 'Yes, I replaced it.', 'About ten minutes.'],
    ['Réponses indirectes', 'Where did you put the sales figures?', 'They’re in the shared folder.', 'About ten percent.', 'Yes, last quarter.'],
    ['Réponses indirectes', 'What’s the best way to reach the sales director?', 'Try her mobile phone.', 'About five years.', 'In the east wing.']
  ];

  // Partie 4 : annonce courte + une question. [catégorie, annonce, question, bonne, 3 pièges]
  const P4 = [
    ['Annonces et messages', 'Attention all staff. The elevators on floors two through five will be out of service tomorrow morning for maintenance. Please use the stairs or the elevators in the east wing. We apologize for the inconvenience.', 'What are employees asked to do?', 'Use other routes between floors', 'Stay home tomorrow', 'Contact maintenance directly', 'Park in the east wing'],
    ['Annonces et messages', 'Good morning, this is Karen Ito from Delta Office Supplies. I’m calling about your order of printer toner. Unfortunately, the cartridges you requested are out of stock until next week. I can ship a different model today at the same price. Please call me back at extension 214.', 'Why is the speaker calling?', 'To report that an item is unavailable', 'To confirm a delivery date', 'To request a payment', 'To offer a refund'],
    ['Annonces et messages', 'Welcome to the quarterly sales meeting. Before we review the numbers, I’d like to thank the Lyon team, who exceeded their target by fifteen percent. After the presentation, lunch will be served in the main lobby.', 'What will happen after the presentation?', 'Lunch will be served', 'The target will change', 'A new team will be introduced', 'The numbers will be revised'],
    ['Annonces et messages', 'This is a reminder that the deadline for submitting expense reports is this Friday at five p.m. Reports submitted after that time will be processed in the next pay cycle. Forms are available on the company website.', 'What happens to late reports?', 'They will be paid later', 'They will be rejected', 'They must be printed', 'They go to the manager'],
    ['Annonces et messages', 'Thank you for calling Brightway Internet. Our offices are closed for the holiday and will reopen on Monday at eight a.m. If you have a technical emergency, press one to speak with an on-call technician.', 'What should callers with an emergency do?', 'Press one', 'Call back Monday', 'Visit the office', 'Send an e-mail'],
    ['Annonces et messages', 'Hello everyone. Our guest speaker, Dr. Moreau, has been delayed because of heavy traffic and will arrive in about thirty minutes. In the meantime, we’ll begin with the product demonstration in Room B.', 'Why is the speaker late?', 'Traffic is heavy', 'The flight was cancelled', 'The room is not ready', 'The demonstration ran long']
  ];

  window.TOEIC = {
    p5: P5.map((r, i) => ({ id: 'p5-' + i, part: 'p5', cat: r[0], q: r[1], a: r[2], w: [r[3], r[4], r[5]], e: r[6] })),
    p2: P2.map((r, i) => ({ id: 'p2-' + i, part: 'p2', cat: r[0], q: r[1], a: r[2], w: [r[3], r[4]] })),
    p4: P4.map((r, i) => ({ id: 'p4-' + i, part: 'p4', cat: r[0], talk: r[1], q: r[2], a: r[3], w: [r[4], r[5], r[6]] }))
  };
})();
