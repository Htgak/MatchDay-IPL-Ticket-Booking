-- Seed Teams Data
INSERT INTO "Teams" (name, short_code, logo_url) VALUES 
('Chennai Super Kings', 'CSK', '/logos/csk.png'),
('Mumbai Indians', 'MI', '/logos/mi.png'),
('Royal Challengers Bangalore', 'RCB', '/logos/rcb.png'),
('Kolkata Knight Riders', 'KKR', '/logos/kkr.png'),
('Delhi Capitals', 'DC', '/logos/dc.png'),
('Rajasthan Royals', 'RR', 'https://upload.wikimedia.org/wikipedia/en/thumb/6/60/Rajasthan_Royals_Logo.svg/200px-Rajasthan_Royals_Logo.svg.png'),
('Punjab Kings', 'PBKS', 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Punjab_Kings_Logo.svg/200px-Punjab_Kings_Logo.svg.png'),
('Sunrisers Hyderabad', 'SRH', '/logos/srh.svg'),
('Lucknow Super Giants', 'LSG', 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a9/Lucknow_Super_Giants_Logo.svg/200px-Lucknow_Super_Giants_Logo.svg.png'),
('Gujarat Titans', 'GT', 'https://upload.wikimedia.org/wikipedia/en/thumb/0/09/Gujarat_Titans_Logo.svg/200px-Gujarat_Titans_Logo.svg.png');

-- Seed Stadiums Data
INSERT INTO "Stadiums" (name, city, image_url) VALUES 
('M. A. Chidambaram Stadium', 'Chennai', 'https://upload.wikimedia.org/wikipedia/commons/e/e0/M._A._Chidambaram_Stadium_panorama.jpg'),
('Wankhede Stadium', 'Mumbai', 'https://upload.wikimedia.org/wikipedia/commons/2/23/Wankhede_Stadium_during_2011_CWC.jpg'),
('M. Chinnaswamy Stadium', 'Bangalore', 'https://upload.wikimedia.org/wikipedia/commons/e/e0/M_Chinnaswamy_Stadium_Bangalore_2.jpg'),
('Eden Gardens', 'Kolkata', 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Eden_Gardens_under_floodlights_during_a_match.jpg');
