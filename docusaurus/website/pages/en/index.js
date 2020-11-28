/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const {siteConfig, language = ''} = this.props;
    const {baseUrl, docsUrl} = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = (doc) => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = (props) => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const Logo = (props) => (
      <div className="projectLogo">
        <img src={props.img_src} alt="Project Logo" />
      </div>
    );

    const ProjectTitle = (props) => (
      <h2 className="projectTitle">
        {props.title}
        <small>{props.tagline}</small>
      </h2>
    );

    const PromoSection = (props) => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = (props) => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <Logo img_src={`${baseUrl}img/undraw_medical.svg`} />
        <div className="inner">
          <ProjectTitle tagline={siteConfig.tagline} title={siteConfig.title} />
          <PromoSection>
            <Button href={docUrl('doc1.html')}>Documentation</Button>
            <Button href={'https://github.com/imamaris/covidcenter-bot'}>Try It Out</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const {config: siteConfig, language = ''} = this.props;
    const {baseUrl} = siteConfig;

    const Block = (props) => (
      <Container
        padding={['bottom', 'top']}
        id={props.id}
        background={props.background}>
        <GridBlock
          align="center"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    const FeatureCallout = () => (
      <div
        className="productShowcaseSection paddingBottom"
        style={{textAlign: 'center'}}>
        <h2>Feature Callout</h2>
        <MarkdownBlock>This bot have capabilities to give relevant information about Covid-19
          from your location This relevant information consist of : Total cases, Death cases, Recovered cases, Hospital, How we handle covid.
          
        </MarkdownBlock>
        
      </div>
    );

    const TryOut = () => (
      <Block id="try">
        {[
          {
            content:
              'We build the script and app first and then write readme how reader could repeat our doings. We ask our friends how understandable the tutorial is. Our friends could understand how they create the app and using wit AI. and they understand what the meaning behind the terms too!',
            image: `${baseUrl}img/chatting.svg`,
            imageAlign: 'left',
            title: 'How we built it?',
          },
        ]}
      </Block>
    );

    const Description = () => (
      <Block background="dark">
        {[
          {
            content:
              'For demonstration purposes, we’ve created a very simple covid bot, but you can create a much more engaging and interactive bot. Try sketching out a larger conversation flow with various scenarios and see Wit documentation to learn more about other Wit features e.g. other built-in entities, custom entities, and traits.',
            image: `${baseUrl}img/undraw_note_list.svg`,
            imageAlign: 'right',
            title: 'Next Step',
          },
        ]}
      </Block>
    );

    const LearnHow = () => (
      <Block background="light">
        {[
          {
            content:
              'In this pandemic situation, many people in Indonesia afraid go out from their house. Thus, they dont know the latest Covid19 news in their neighbourhood, they would like to know how many cases in their area, death cases and recover cases.</br>' +
              '</br> For that inspiration, we want to build covid center to engage people for learning **wit.ai** and messenger. We choose this case study because we want to relate their worries and turn it into learning spirit. We hope many people enjoy our tutorial and understand about wit.ai and messenger.',
            image: `${baseUrl}img/test_messenger_covid.gif`,
            imageAlign: 'right',
            title: 'Inspiration',
          },
        ]}
      </Block>
    );

    const TitleFeature = () => (
      <div
        className="productShowcaseSection paddingBottom"
        style={{textAlign: 'center'}}>
        <h2>Our Tools</h2>
      </div>
    );

    const Features = () => (
      
      <Block layout="fourColumn">
        
        {[
          {
            content: 'Create & Training bot </br> to do natural language processing',
            image: `${baseUrl}img/bot.ico`,
            imageAlign: 'top',
            title: 'Wit.Ai',
            
          },
          {
            content: 'Platform for interaction with bot',
            image: `${baseUrl}img/messenger_logo.ico`,
            imageAlign: 'top',
            title: 'Messenger',
          },
          {
            content: 'API, Messenger and Wit.Ai Integration',
            image: `${baseUrl}img/nodejs.ico`,
            imageAlign: 'top',
            title: 'Node.js',
          },
          
        ]}
      </Block>
      
    );

    const Showcase = () => {
      if ((siteConfig.users || []).length === 0) {
        return null;
      }

      const showcase = siteConfig.users
        .filter((user) => user.pinned)
        .map((user) => (
          <a href={user.infoLink} key={user.infoLink}>
            <img src={user.image} alt={user.caption} title={user.caption} />
          </a>
        ));

      const pageUrl = (page) =>
        baseUrl + (language ? `${language}/` : '') + page;

      return (
        <div className="productShowcaseSection paddingBottom">
          <h2>Who is Using This?</h2>
          <p>This project is used by all these people</p>
          <div className="logos">{showcase}</div>
          <div className="more-users">
            <a className="button" href={pageUrl('users.html')}>
              More {siteConfig.title} Users
            </a>
          </div>
        </div>
      );
    };

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <TitleFeature /> 
          <Features /> 
          <FeatureCallout />
          <LearnHow />
          <TryOut />
          <Description />
          <Showcase />
        </div>
      </div>
    );
  }
}

module.exports = Index;
